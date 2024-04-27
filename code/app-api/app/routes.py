from fastapi import FastAPI, File, UploadFile
import logging

from . import graphql, init, ai

logger = logging.getLogger(__name__)

#### Routes ####

app = FastAPI()


@app.on_event("startup")
async def reinit():
    init.init()


app.include_router(graphql.get_app(), prefix="/api")


@app.post("/upload")
def upload(file: UploadFile = File(...)):
    with open(f"/tmp/{file.filename}", "wb") as f:
        f.write(file.file.read())
    return {"status": "ok"}


@app.get("/analysis")
async def analysis(file: str):
    with open(f"/tmp/{file}", "r") as f:
        code = f.read()
        return ai.analyze(code)
