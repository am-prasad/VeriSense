import speech_recognition as sr
import os
from pydub import AudioSegment
from typing import Optional

# Initialize the recognizer
r = sr.Recognizer()

def transcribe_audio(file_path: str) -> str:
    """
    Transcribes the audio file using the Google Web Speech API via the 
    SpeechRecognition library.

    Args:
        file_path (str): The path to the uploaded audio file.

    Returns:
        str: The transcribed text or an error message.
    """
    temp_wav_path: Optional[str] = None
    original_file_path = file_path

    try:
        # 1. Convert/Load the audio file to a standard WAV format using pydub.
        # This handles various web upload formats (mp3, m4a, etc.).
        temp_wav_path = original_file_path + ".wav"
        audio = AudioSegment.from_file(original_file_path)
        audio.export(temp_wav_path, format="wav")
        
        # 2. Transcribe the audio
        with sr.AudioFile(temp_wav_path) as source:
            # Adjusts for ambient noise for better accuracy
            r.adjust_for_ambient_noise(source, duration=0.5)
            audio_data = r.record(source) 
        
        # Use Google Web Speech API (no API key needed for basic usage)
        transcript = r.recognize_google(audio_data)
        
    except sr.UnknownValueError:
        transcript = "Could not understand the audio. Please speak more clearly."
    except sr.RequestError as e:
        transcript = f"Speech API error. Check your network or API limits: {e}"
    except Exception as e:
        # This handles issues like pydub failing to load non-standard formats, 
        # or missing FFmpeg/ffprobe if needed by pydub.
        transcript = f"An unexpected transcription error occurred (Missing pydub/FFmpeg dependencies?): {e}"
    finally:
        # 3. Clean up the temporary WAV file if it was created
        if temp_wav_path and os.path.exists(temp_wav_path):
            os.remove(temp_wav_path)
            
    return transcript
