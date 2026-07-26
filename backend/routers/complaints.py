from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from services.database import get_db
import uuid
from typing import Optional

router = APIRouter(prefix="/api/v1/complaints", tags=["complaints"])

class CreateComplaintRequest(BaseModel):
    title: Optional[str] = None
    description: str
    lat: float
    lng: Optional[float] = None
    lon: Optional[float] = None
    sector_id: str
    citizen_name: Optional[str] = "Anonymous"
    phone: Optional[str] = ""

@router.get("")
async def list_complaints(sector_id: Optional[str] = None):
    db = await get_db()
    try:
        if sector_id and sector_id != "HQ":
            cursor = await db.execute(
                """SELECT complaints.*, sectors.name as sector_name 
                   FROM complaints 
                   LEFT JOIN sectors ON complaints.sector_id = sectors.id
                   WHERE complaints.sector_id = ? OR complaints.sector_id = ?
                   ORDER BY complaints.created_at DESC""",
                (sector_id, f"SEC_{sector_id.upper()}")
            )
        else:
            cursor = await db.execute(
                """SELECT complaints.*, sectors.name as sector_name 
                   FROM complaints 
                   LEFT JOIN sectors ON complaints.sector_id = sectors.id
                   ORDER BY complaints.created_at DESC"""
            )
        rows = await cursor.fetchall()
        return [dict(r) for r in rows]
    finally:
        await db.close()

@router.post("")
async def create_complaint(req: CreateComplaintRequest):
    db = await get_db()
    try:
        cid = f"CMP-{uuid.uuid4().hex[:6].upper()}"
        longitude = req.lon if req.lon is not None else (req.lng if req.lng is not None else 83.2150)
        issue = req.title or "Water Supply Issue"
        
        await db.execute(
            """INSERT INTO complaints 
               (id, citizen_name, phone, lat, lon, issue_type, sector_id, description, status)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'PENDING')""",
            (cid, req.citizen_name, req.phone, req.lat, longitude, issue, req.sector_id, req.description)
        )
        await db.commit()
        return {"message": "Complaint submitted successfully", "id": cid}
    finally:
        await db.close()
