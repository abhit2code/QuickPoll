import asyncpg
import os

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost:5432/quickpoll")

async def get_db():
    return await asyncpg.connect(DATABASE_URL)

async def init_db():
    conn = await get_db()
    await conn.execute('''
        CREATE TABLE IF NOT EXISTS polls (
            id SERIAL PRIMARY KEY,
            title TEXT NOT NULL,
            options JSONB NOT NULL,
            votes JSONB DEFAULT '[]',
            likes INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT NOW()
        )
    ''')
    await conn.execute('''
        CREATE TABLE IF NOT EXISTS comments (
            id SERIAL PRIMARY KEY,
            poll_id INTEGER REFERENCES polls(id),
            text TEXT NOT NULL,
            likes INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT NOW()
        )
    ''')
    await conn.close()
