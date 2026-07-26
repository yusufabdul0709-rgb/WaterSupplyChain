from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.database import get_db

router = APIRouter(prefix="/api/v1/sectors", tags=["sectors"])

class CreateSectorAdminRequest(BaseModel):
    username: str
    password: str
    sector_id: str
    full_name: str = ""
    email: str = ""

@router.get("")
async def list_sectors():
    db = await get_db()
    try:
        cursor = await db.execute("SELECT * FROM sectors")
        rows = await cursor.fetchall()
        return [dict(r) for r in rows]
    finally:
        await db.close()

@router.post("/admin/create")
async def create_sector_admin(req: CreateSectorAdminRequest):
    db = await get_db()
    try:
        email = req.email or f"{req.username}@gvmc.gov.in"
        await db.execute(
            """INSERT INTO users (username, email, password_hash, role, sector_id, full_name)
               VALUES (?, ?, ?, 'SECTOR_ADMIN', ?, ?)""",
            (req.username, email, req.password, req.sector_id, req.full_name or req.username)
        )
        await db.commit()
        return {"message": "Sector admin created successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail="Username or Email already exists")
    finally:
        await db.close()
