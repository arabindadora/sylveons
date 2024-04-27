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


@app.post("/api/v2/upload")
def upload(file: UploadFile = File(...)):
    logger.info("received new upload request")
    with open(f"/tmp/{file.filename}", "wb") as f:
        f.write(file.file.read())
        logger.info(f"Uploaded file: {file.filename} successfully")
    return {"status": "ok"}


@app.get("/api/v2/analysis")
async def analysis(file: str):
    logger.info(f"Analyzing file: {file}")
    with open(f"/tmp/{file}", "r") as f:
        code = f.read()
        logger.info(f"read code from {file} successfully")
        response = ai.analyze(code)
        logger.info("analysis completed successfully")
        return response
