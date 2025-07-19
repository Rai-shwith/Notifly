from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import firebase_admin
from firebase_admin import credentials, messaging

app = FastAPI()

# Initialize Firebase Admin SDK on startup
cred = credentials.Certificate("./serviceAccountKey.json")
firebase_admin.initialize_app(cred)

# In-memory storage for the latest FCM token
latest_token: str | None = None

class RegisterTokenRequest(BaseModel):
    token: str

class SendNotificationRequest(BaseModel):
    title: str
    message: str
    theme: str

@app.post("/register")
def register_token(request: RegisterTokenRequest):
    global latest_token
    latest_token = request.token
    print("Token: ",latest_token)
    return {"message": "Token registered successfully", "token": latest_token}

@app.post("/notify")
def send_notification(request: SendNotificationRequest):
    if not latest_token:
        raise HTTPException(status_code=400, detail="No token registered yet")

    # Construct the message with notification and data payload
    message = messaging.Message(
        token=latest_token,
        notification=messaging.Notification(
            title=request.title,
            body=request.message,
        ),
        data={
            "theme": request.theme
        }
    )

    # Send the message via Firebase Admin SDK
    response = messaging.send(message)
    print(f"Notification sent successfully: {response}")

    return {"message_id": response}

@app.get("/ping")
def ping():
    return {"message": "Backend is live"}
