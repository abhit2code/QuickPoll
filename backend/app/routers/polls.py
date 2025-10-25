from fastapi import APIRouter, HTTPException
from app.models import PollCreate, Vote, Like, Comment, CommentLike
from app.database import get_db
from app.websocket import manager
import json

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
async def get_polls():
    conn = await get_db()
    rows = await conn.fetch("SELECT * FROM polls ORDER BY created_at DESC")
    
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
    
    await conn.execute(
        "UPDATE polls SET likes = likes + 1 WHERE id = $1",
        like_data.poll_id
    )
    
    likes = await conn.fetchval("SELECT likes FROM polls WHERE id = $1", like_data.poll_id)
    await conn.close()
    
    await manager.broadcast(json.dumps({
        "type": "like_update",
        "poll_id": like_data.poll_id,
        "likes": likes
    }))
    
    return {"success": True}

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
    
    await conn.execute(
        "UPDATE comments SET likes = likes + 1 WHERE id = $1",
        like_data.comment_id
    )
    
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
