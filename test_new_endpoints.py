#!/usr/bin/env python3
"""
Test script for new QuickPoll endpoints
"""
import asyncio
import asyncpg
import json
from datetime import datetime

async def test_endpoints():
    # Connect to database
    DATABASE_URL = "postgresql://user:password@localhost:5432/quickpoll"
    
    try:
        conn = await asyncpg.connect(DATABASE_URL)
        print("Database connection successful")
        
        # Test search functionality
        search_query = "SELECT * FROM polls WHERE LOWER(title) LIKE $1 ORDER BY created_at DESC"
        result = await conn.fetch(search_query, "%test%")
        print(f"Search query works - found {len(result)} polls")
        
        # Test trending query (most voted)
        trending_query = """
            SELECT *, 
            (SELECT SUM((votes::jsonb->>i)::int) 
             FROM generate_series(0, jsonb_array_length(votes)-1) i) as total_votes
            FROM polls 
            WHERE created_at >= NOW() - INTERVAL '7 days'
            ORDER BY total_votes DESC 
            LIMIT 5
        """
        result = await conn.fetch(trending_query)
        print(f"Trending query works - found {len(result)} trending polls")
        
        # Test stats queries
        total_polls = await conn.fetchval("SELECT COUNT(*) FROM polls")
        print(f"Stats query works - total polls: {total_polls}")
        
        # Test total votes calculation
        total_votes = await conn.fetchval("""
            SELECT COALESCE(SUM(
                (SELECT SUM((votes::jsonb->>i)::int) 
                 FROM generate_series(0, jsonb_array_length(votes)-1) i)
            ), 0) FROM polls
        """)
        print(f"Total votes calculation works - total votes: {total_votes}")
        
        await conn.close()
        print("All database queries work correctly!")
        
    except Exception as e:
        print(f"Database test failed: {e}")
        print("Note: This is expected if the database is not running")

if __name__ == "__main__":
    asyncio.run(test_endpoints())
