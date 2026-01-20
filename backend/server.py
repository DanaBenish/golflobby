from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

conn = sqlite3.connect("golf.db", check_same_thread=False)
cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS tee_times (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id INTEGER,
    time TEXT,
    is_full INTEGER DEFAULT 0
)
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS players (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    tee_time_id INTEGER
)
""")

conn.commit()
cursor.close()

class JoinRequest(BaseModel):
    name: str
    course_id: int
    time: str

@app.post("/join")
def join_tee_time(req: JoinRequest):
    cursor = conn.cursor()
    cursor.execute(
        "SELECT id, is_full FROM tee_times WHERE course_id=? AND time=?",
        (req.course_id, req.time)
    )
    tee_time = cursor.fetchone()

    if tee_time:
        tee_time_id, is_full = tee_time
        if is_full:
            cursor.close()
            raise HTTPException(status_code=400, detail="Tee time full")
    else:
        cursor.execute(
            "INSERT INTO tee_times (course_id, time) VALUES (?, ?)",
            (req.course_id, req.time)
        )
        tee_time_id = cursor.lastrowid

    cursor.execute(
        "SELECT COUNT(*) FROM players WHERE tee_time_id=?",
        (tee_time_id,)
    )
    count = cursor.fetchone()[0]

    if count >= 4:
        cursor.close()
        raise HTTPException(status_code=400, detail="Tee time full")

    cursor.execute(
        "INSERT INTO players (name, tee_time_id) VALUES (?, ?)",
        (req.name, tee_time_id)
    )

    if count + 1 == 4:
        cursor.execute(
            "UPDATE tee_times SET is_full=1 WHERE id=?",
            (tee_time_id,)
        )

    conn.commit()
    cursor.close()
    return {"message": "Joined tee time"}

@app.get("/tee-time")
def get_tee_time(course_id: int, time: str):
    cursor = conn.cursor()
    cursor.execute(
        "SELECT id FROM tee_times WHERE course_id=? AND time=?",
        (course_id, time)
    )
    row = cursor.fetchone()
    if not row:
        cursor.close()
        return {"players": [], "is_full": False}

    tee_time_id = row[0]
    cursor.execute(
        "SELECT name FROM players WHERE tee_time_id=?",
        (tee_time_id,)
    )
    players = [p[0] for p in cursor.fetchall()]
    cursor.close()
    return {
        "players": players,
        "is_full": len(players) >= 4
    }
