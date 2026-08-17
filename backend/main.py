import os
from fastapi import FastAPI
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="OrbitLink & OrbitGen Backend",
    description="Motor ETL y de IA Generativa para DQOrbit",
    version="1.0.0"
)

@app.get("/")
def read_root():
    return {"status": "online", "message": "OrbitLink Engine API is running"}

@app.get("/api/health")
def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
