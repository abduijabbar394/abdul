from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from faster_whisper import WhisperModel
import tempfile
import os

app = FastAPI(title="Audio to Text Converter (Bangla)", version="1.0")

# Enable CORS (Cross-Origin Resource Sharing)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Load the whisper model (we'll use 'base' for faster processing and lower memory usage)
# You can change 'base' to 'small', 'medium', or 'large-v3' depending on server resources
print("Loading Whisper Model...")
model_size = "base"
model = WhisperModel(model_size, device="cpu", compute_type="int8")
print("Model loaded successfully!")

@app.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    if not file.filename.endswith(('.mp3', '.wav', '.m4a', '.aac', '.ogg')):
        raise HTTPException(status_code=400, detail="অসমর্থিত ফাইল ফরম্যাট। দয়া করে mp3, wav, m4a, aac বা ogg ফাইল আপলোড করুন।")
    
    # Save uploaded file to a temporary file
    temp_audio_path = ""
    try:
        # Create a temporary file
        fd, temp_audio_path = tempfile.mkstemp(suffix=os.path.splitext(file.filename)[1])
        with os.fdopen(fd, 'wb') as f:
            f.write(await file.read())

        # Transcribe audio
        segments, info = model.transcribe(temp_audio_path, beam_size=5)
        
        # We can extract language if needed, but we mainly want the text
        text_result = ""
        for segment in segments:
            text_result += segment.text + " "
            
        return {
            "success": True,
            "text": text_result.strip(),
            "language": info.language
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Clean up temporary file
        if temp_audio_path and os.path.exists(temp_audio_path):
            os.remove(temp_audio_path)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
