from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import uvicorn

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite's default development server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SignatureRequest(BaseModel):
    templateId: int
    documentId: str

@app.post("/api/send-for-signature")
async def send_for_signature(request: SignatureRequest):
    try:
        # Here you would implement the actual signature request logic
        # For now, we'll just return a success message with the template ID
        return {
            "status": "success",
            "message": f"Signature request sent for template {request.templateId}",
            "templateId": request.templateId,
            "documentId": request.documentId
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)