from fastapi import APIRouter, HTTPException, Query
from app.models import PollCreate, Vote, Like, Comment, CommentLike, SearchQuery, FilterQuery
from app.database import get_db
from app.websocket import manager
import json
from datetime import datetime, timedelta
from typing import Optional

router = APIRouter(prefix="/polls", tags=["polls"])

@router.post("/")
async def create_poll(poll: PollCreate):
    conn = await get_db()
    options = json.dumps(poll.options)
    votes = json.dumps([0] * len(poll.options))
    
    poll_id = await conn.fetchval(
        "INSERT INTO polls (title, options, votes) VALUES ($1, $2, $3) RETURNING id",
        poll.title, options, votes
    )
    await conn.close()
    
    await manager.broadcast(json.dumps({"type": "new_poll", "poll_id": poll_id}))
    return {"id": poll_id}

@router.get("/")
async def get_polls(
    search: Optional[str] = Query(None),
    view: Optional[str] = Query("All Polls"),
    time_period: Optional[str] = Query("All Time"),
    sort_by: Optional[str] = Query("Newest First")
):
    conn = await get_db()
    
    # Build base query
    base_query = "SELECT * FROM polls"
    conditions = []
    params = []
    
    # Search filter
    if search:
        conditions.append("LOWER(title) LIKE $" + str(len(params) + 1))
        params.append(f"%{search.lower()}%")
    
    # View filter (placeholder for future user-specific filtering)
    # Note: Currently all views show all polls since we don't have user authentication
    # This can be extended when user system is implemented
    
    # Time period filter
    if time_period != "All Time":
        now = datetime.now()
        time_filter = {
            "Today": now.replace(hour=0, minute=0, second=0, microsecond=0),
            "This Week": now - timedelta(weeks=1),
            "This Month": now - timedelta(days=30)
        }
        if time_period in time_filter:
            conditions.append("created_at >= $" + str(len(params) + 1))
            params.append(time_filter[time_period])
    
    # Add WHERE clause if conditions exist
    if conditions:
        base_query += " WHERE " + " AND ".join(conditions)
    
    # Sort order
    sort_mapping = {
        "Newest First": "created_at DESC",
        "Oldest First": "created_at ASC",
        "Most Popular": "likes DESC",
        "Most Voted": "(SELECT SUM((votes::jsonb->>i)::int) FROM generate_series(0, jsonb_array_length(votes)-1) i) DESC",
        "Most Comments": "(SELECT COUNT(*) FROM comments WHERE poll_id = polls.id) DESC"
    }
    
    order_clause = sort_mapping.get(sort_by, "created_at DESC")
    base_query += f" ORDER BY {order_clause}"
    
    rows = await conn.fetch(base_query, *params)
    
    polls = []
    for row in rows:
        # Get comments for each poll
        comments = await conn.fetch(
            "SELECT * FROM comments WHERE poll_id = $1 ORDER BY created_at DESC",
            row["id"]
        )
        
        polls.append({
            "id": row["id"],
            "title": row["title"],
            "options": json.loads(row["options"]),
            "votes": json.loads(row["votes"]),
            "likes": row["likes"],
            "created_at": row["created_at"].isoformat(),
            "comments": [
                {
                    "id": comment["id"],
                    "text": comment["text"],
                    "likes": comment["likes"],
                    "created_at": comment["created_at"].isoformat()
                }
                for comment in comments
            ]
        })
    
    await conn.close()
    return polls

@router.get("/search")
async def search_polls(q: str = Query(..., description="Search query")):
    conn = await get_db()
    
    rows = await conn.fetch(
        "SELECT * FROM polls WHERE LOWER(title) LIKE $1 ORDER BY created_at DESC",
        f"%{q.lower()}%"
    )
    
    polls = []
    for row in rows:
        comments = await conn.fetch(
            "SELECT * FROM comments WHERE poll_id = $1 ORDER BY created_at DESC",
            row["id"]
        )
        
        polls.append({
            "id": row["id"],
            "title": row["title"],
            "options": json.loads(row["options"]),
            "votes": json.loads(row["votes"]),
            "likes": row["likes"],
            "created_at": row["created_at"].isoformat(),
            "comments": [
                {
                    "id": comment["id"],
                    "text": comment["text"],
                    "likes": comment["likes"],
                    "created_at": comment["created_at"].isoformat()
                }
                for comment in comments
            ]
        })
    
    await conn.close()
    return polls

@router.get("/trending")
async def get_trending():
    conn = await get_db()
    
    # Most voted polls
    most_voted = await conn.fetch("""
        SELECT *, 
        (SELECT SUM((votes::jsonb->>i)::int) 
         FROM generate_series(0, jsonb_array_length(votes)-1) i) as total_votes
        FROM polls 
        WHERE created_at >= NOW() - INTERVAL '7 days'
        ORDER BY total_votes DESC 
        LIMIT 5
    """)
    
    # Most liked polls
    most_liked = await conn.fetch("""
        SELECT * FROM polls 
        WHERE created_at >= NOW() - INTERVAL '7 days'
        ORDER BY likes DESC 
        LIMIT 5
    """)
    
    # Most commented polls
    most_commented = await conn.fetch("""
        SELECT p.*, COUNT(c.id) as comment_count
        FROM polls p
        LEFT JOIN comments c ON p.id = c.poll_id
        WHERE p.created_at >= NOW() - INTERVAL '7 days'
        GROUP BY p.id
        ORDER BY comment_count DESC
        LIMIT 5
    """)
    
    await conn.close()
    
    return {
        "most_voted": [
            {
                "id": row["id"],
                "title": row["title"],
                "total_votes": row.get("total_votes", 0)
            }
            for row in most_voted
        ],
        "most_liked": [
            {
                "id": row["id"],
                "title": row["title"],
                "likes": row["likes"]
            }
            for row in most_liked
        ],
        "most_commented": [
            {
                "id": row["id"],
                "title": row["title"],
                "comment_count": row.get("comment_count", 0)
            }
            for row in most_commented
        ]
    }

@router.get("/stats")
async def get_stats():
    conn = await get_db()
    
    # Total polls
    total_polls = await conn.fetchval("SELECT COUNT(*) FROM polls")
    
    # Active polls (created in last 30 days)
    active_polls = await conn.fetchval(
        "SELECT COUNT(*) FROM polls WHERE created_at >= NOW() - INTERVAL '30 days'"
    )
    
    # Total votes across all polls
    total_votes = await conn.fetchval("""
        SELECT COALESCE(SUM(
            (SELECT SUM((votes::jsonb->>i)::int) 
             FROM generate_series(0, jsonb_array_length(votes)-1) i)
        ), 0) FROM polls
    """)
    
    # Total likes
    total_likes = await conn.fetchval("SELECT COALESCE(SUM(likes), 0) FROM polls")
    
    # Total comments
    total_comments = await conn.fetchval("SELECT COUNT(*) FROM comments")
    
    # Polls created today
    polls_today = await conn.fetchval(
        "SELECT COUNT(*) FROM polls WHERE DATE(created_at) = CURRENT_DATE"
    )
    
    # Average votes per poll
    avg_votes = await conn.fetchval("""
        SELECT COALESCE(AVG(
            (SELECT SUM((votes::jsonb->>i)::int) 
             FROM generate_series(0, jsonb_array_length(votes)-1) i)
        ), 0) FROM polls
    """)
    
    await conn.close()
    
    return {
        "total_polls": total_polls,
        "active_polls": active_polls,
        "total_votes": total_votes,
        "total_likes": total_likes,
        "total_comments": total_comments,
        "polls_today": polls_today,
        "avg_votes_per_poll": round(float(avg_votes or 0), 1)
    }

@router.post("/vote")
async def vote(vote_data: Vote):
    conn = await get_db()
    
    row = await conn.fetchrow("SELECT votes FROM polls WHERE id = $1", vote_data.poll_id)
    if not row:
        raise HTTPException(status_code=404, detail="Poll not found")
    
    votes = json.loads(row["votes"])
    votes[vote_data.option_index] += 1
    
    await conn.execute(
        "UPDATE polls SET votes = $1 WHERE id = $2",
        json.dumps(votes), vote_data.poll_id
    )
    await conn.close()
    
    await manager.broadcast(json.dumps({
        "type": "vote_update",
        "poll_id": vote_data.poll_id,
        "votes": votes
    }))
    
    return {"success": True}

@router.post("/like")
async def like_poll(like_data: Like):
    conn = await get_db()
    
    if like_data.is_liked:
        # Add like
        await conn.execute("UPDATE polls SET likes = likes + 1 WHERE id = $1", like_data.poll_id)
    else:
        # Remove like
        await conn.execute("UPDATE polls SET likes = GREATEST(likes - 1, 0) WHERE id = $1", like_data.poll_id)
    
    likes = await conn.fetchval("SELECT likes FROM polls WHERE id = $1", like_data.poll_id)
    await conn.close()
    
    await manager.broadcast(json.dumps({
        "type": "like_update",
        "poll_id": like_data.poll_id,
        "likes": likes
    }))
    
    return {"success": True, "likes": likes}

@router.post("/comment")
async def add_comment(comment_data: Comment):
    conn = await get_db()
    
    comment_id = await conn.fetchval(
        "INSERT INTO comments (poll_id, text) VALUES ($1, $2) RETURNING id",
        comment_data.poll_id, comment_data.text
    )
    
    comment = await conn.fetchrow(
        "SELECT * FROM comments WHERE id = $1", comment_id
    )
    await conn.close()
    
    await manager.broadcast(json.dumps({
        "type": "new_comment",
        "poll_id": comment_data.poll_id,
        "comment": {
            "id": comment["id"],
            "text": comment["text"],
            "likes": comment["likes"],
            "created_at": comment["created_at"].isoformat()
        }
    }))
    
    return {"id": comment_id}

@router.post("/comment/like")
async def like_comment(like_data: CommentLike):
    conn = await get_db()
    
    if like_data.is_liked:
        # Add like
        await conn.execute("UPDATE comments SET likes = likes + 1 WHERE id = $1", like_data.comment_id)
    else:
        # Remove like
        await conn.execute("UPDATE comments SET likes = GREATEST(likes - 1, 0) WHERE id = $1", like_data.comment_id)
    
    comment = await conn.fetchrow(
        "SELECT id, poll_id, likes FROM comments WHERE id = $1",
        like_data.comment_id
    )
    await conn.close()
    
    await manager.broadcast(json.dumps({
        "type": "comment_like_update",
        "comment_id": comment["id"],
        "poll_id": comment["poll_id"],
        "likes": comment["likes"]
    }))
    
    return {"success": True}
