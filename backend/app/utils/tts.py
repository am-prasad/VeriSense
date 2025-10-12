import pyttsx3
import tempfile

def generate_speech(text):
    engine = pyttsx3.init()
    tmp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".mp3")
    engine.save_to_file(text, tmp_file.name)
    engine.runAndWait()
    return tmp_file.name
