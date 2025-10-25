#!/bin/bash
cd /Users/abhitrana/Documents/coding/quickpoll/backend
export DATABASE_URL="postgresql://user:password@localhost:5432/quickpoll"
export PATH="/Users/abhitrana/Library/Python/3.9/bin:$PATH"
python3 -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
