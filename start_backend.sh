#!/bin/bash
cd /Users/abhitrana/Documents/coding/quickpoll/backend
export DATABASE_URL="postgresql://user:password@localhost:5432/quickpoll"
source venv/bin/activate
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 --proxy-headers