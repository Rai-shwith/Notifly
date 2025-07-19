from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import firebase_admin
from firebase_admin import credentials, messaging

app = FastAPI()

# Initialize Firebase Admin SDK on startup
cred = credentials.Certificate("./serviceAccountKey.json")
firebase_admin.initialize_app(cred)

# In-memory storage for the latest FCM token
latest_token: str | None = "fjpwSDslRpKy3gjizTvLH7:APA91bGjUXgF1LCf5tioEhv2aunRhXAcl0_wxYs7IgI8NbATIRdFsjiBVA6AJUUSBQcO8LoflFSOojTc3uTpVWYou24IYCgkFx_SbSZzlkQ-RwZKhoe_3iU"

class RegisterTokenRequest(BaseModel):
    token: str

class SendNotificationRequest(BaseModel):
    title: str
    message: str
    theme: str
