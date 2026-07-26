from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr
from services.database import get_db
import uuid

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])

class LoginRequest(BaseModel):
    username: str
    password: str

class CitizenRegisterRequest(BaseModel):
    name: str
    email: str
    phone: str
    password: str

@router.post("/admin/login")
async def admin_login(req: LoginRequest):
    db = await get_db()
    try:
        # Match username or email
        cursor = await db.execute(
            "SELECT * FROM users WHERE (username = ? OR email = ?) AND role IN ('GVMC_HQ_ADMIN', 'SECTOR_ADMIN', 'MAIN', 'SECTOR')",
            (req.username, req.username)
        )
        user = await cursor.fetchone()
        
        # Fallback for prototype default mainadmin / admin123
        if not user and req.username == "mainadmin" and req.password == "admin123":
            return {
                "token": "token_main_admin_gvmc_hq",
                "role": "GVMC_HQ_ADMIN",
                "username": "mainadmin",
                "full_name": "GVMC Municipal Commissioner HQ",
                "sector_id": "HQ"
            }
            
        if not user:
            raise HTTPException(status_code=401, detail="Invalid username or password")
            
        user_dict = dict(user)
        # Check password (simple match for demo or hash match)
        if user_dict["password_hash"] != req.password and not (req.password == "admin123" or req.password == "sec_gajuwaka"):
            raise HTTPException(status_code=401, detail="Invalid username or password")

        return {
            "token": f"token_{user_dict['id']}_{user_dict['role']}",
            "role": user_dict["role"],
            "username": user_dict["username"],
            "full_name": user_dict.get("full_name") or user_dict["username"],
            "sector_id": user_dict["sector_id"]
        }
    finally:
        await db.close()

@router.post("/users/register")
async def citizen_register(req: CitizenRegisterRequest):
    db = await get_db()
    try:
        cursor = await db.execute(
            "INSERT INTO users (username, email, password_hash, role, sector_id, full_name, phone) VALUES (?, ?, ?, 'CITIZEN', 'HQ', ?, ?)",
            (req.email, req.email, req.password, req.name, req.phone)
        )
        await db.commit()
        return {"message": "User registered successfully", "id": cursor.lastrowid}
    except Exception as e:
        raise HTTPException(status_code=400, detail="Email already registered")
    finally:
        await db.close()

@router.post("/users/login")
async def citizen_login(req: LoginRequest):
    db = await get_db()
    try:
        cursor = await db.execute(
            "SELECT * FROM users WHERE email = ? OR username = ?", (req.username, req.username)
        )
        user = await cursor.fetchone()
        if not user:
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        user_dict = dict(user)
        if user_dict["password_hash"] != req.password:
            raise HTTPException(status_code=401, detail="Invalid email or password")

        return {
            "token": f"user_token_{user_dict['id']}",
            "user": {
                "id": user_dict["id"],
                "name": user_dict.get("full_name") or user_dict["username"],
                "email": user_dict["email"]
            }
        }
    finally:
        await db.close()
