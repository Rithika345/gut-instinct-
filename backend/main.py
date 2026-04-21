from fastapi import FastAPI

app = FastAPI()


@app.post("/analyze")
async def analyze():
    return {"status": "not implemented yet"}
