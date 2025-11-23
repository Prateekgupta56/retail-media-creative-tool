from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
from fastapi.responses import JSONResponse, FileResponse
import os, json

app = FastAPI(title="Retail Creative Builder - API Prototype")

BASE_DIR = os.path.dirname(__file__)
ASSETS_DIR = os.path.join(BASE_DIR, "..", "assets")
CANVAS_DIR = os.path.join(BASE_DIR, "..", "canvas")

# Simple models
class ImportRequest(BaseModel):
    url: str
    type: str = "packshot"

@app.post("/api/assets/import")
async def import_asset(payload: ImportRequest):
    # In this prototype, we accept the local path and return basic metadata
    if not os.path.exists(payload.url):
        return JSONResponse(status_code=400, content={ "error": "asset not found", "url": payload.url })
    return {
        "asset_id": "asset_1",
        "url": payload.url,
        "type": payload.type
    }

@app.post("/api/layouts/suggest")
async def suggest_layouts():
    # Return the three example canvas JSONs
    examples = []
    for fname in ["creative_square_1080.json", "creative_vertical_1080x1920.json", "creative_landscape_1200x628.json"]:
        path = os.path.join(CANVAS_DIR, fname)
        with open(path, "r") as fh:
            examples.append(json.load(fh))
    return { "candidates": examples }

@app.post("/api/validate")
async def validate_canvas(payload: dict):
    # Return sample validation results (deterministic + suggestions)
    sample_path = os.path.join(CANVAS_DIR, "sample_validation.json")
    with open(sample_path, "r") as fh:
        report = json.load(fh)
    return report

@app.post("/api/export")
async def export_canvas(payload: dict):
    # Stub: In production this would flatten the canvas, optimize and return a download URL
    return { "status": "ok", "message": "Export pipeline not implemented in prototype. Implement using Pillow + mozjpeg + libvips." }

@app.get("/api/assets/example")
async def get_example_asset():
    # Return the included example asset
    filepath = os.path.abspath(os.path.join(BASE_DIR, "..", "assets", "example_packshot.png"))
    return FileResponse(filepath, media_type="image/png", filename="example_packshot.png")
