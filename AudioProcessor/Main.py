import speech_recognition as sr
import numpy as np
import pyaudio
import ChatBot as chatbot
import time

# Parameters for audio
CHUNK = 1024  # Number of audio samples per frame
RATE = 44100  # Sample rate
THRESHOLD = 0.2  # Volume threshold for loud noise detection

# Initialize PyAudio and SpeechRecognition
recognizer = sr.Recognizer()
audio = pyaudio.PyAudio()

activation_phrases = ["hello", "hi", "hey", "anna"]

# Function to detect loud noises
def detect_loud_noise():
    """
    Continuously samples the microphone for loud noises.
    If a loud noise above the threshold is detected, returns True.
    """
    stream = audio.open(format=pyaudio.paInt16, channels=1, rate=RATE, input=True, frames_per_buffer=CHUNK)
    data = np.frombuffer(stream.read(CHUNK, exception_on_overflow=False), dtype=np.int16)
    stream.stop_stream()
    stream.close()

    # Calculate RMS volume and normalize
    rms = np.sqrt(np.mean(np.square(data.astype(np.float32)))) / 32768  # Normalize volume to range 0-1
    if rms > THRESHOLD:
        print("Loud noise detected!")
        return True
    return False


# Function to listen for voice commands
def listen_for_voice_command():
    """
    Listens for voice commands and processes activation/shutdown phrases.
    """
    with sr.Microphone() as source:
        recognizer.adjust_for_ambient_noise(source)
        print("Listening for voice commands...")
        try:
            audio_data = recognizer.listen(source, timeout=5)
            user_input = recognizer.recognize_google(audio_data).lower()
            print(f"You said: {user_input}")

            # Check for shutdown command
            if any(phrase in user_input for phrase in ["turn off device", "shutdown", "power off", "stop listening"]):
                chatbot.speak("Shutting down the device. Goodbye!")
                print("Device shutting down.")
                return "shutdown"

            # Check for activation phrases
            if any(phrase in user_input for phrase in activation_phrases):
                return "activated"

            # Check for deactivation commands
            if any(exit_phrase in user_input for exit_phrase in ["goodbye", "bye", "exit", "quit"]):
                chatbot.speak("Goodbye. Monitoring will continue.")
                return "deactivated"

            # Process user input through the chatbot if active
            chatbot.voice_chatbot(user_input)
            return "active"

        except sr.WaitTimeoutError:
            print("No input detected.")
        except sr.UnknownValueError:
            print("Could not understand audio.")
        except sr.RequestError as e:
            print(f"Request error with Speech Recognition service: {e}")

    return None


# Main function to manage monitoring and interaction phases
def monitor():
    print("Starting elderly monitoring system. Say 'Hello' to activate or make a loud noise.")
    active = False
    interaction_mode = False  # Tracks if we’re in interaction mode after activation

    while True:
        # Activation Phase: Detect loud noise or listen for activation phrase
        if not interaction_mode:
            if detect_loud_noise():
                chatbot.speak("I heard a loud sound. How can I help?")
                interaction_mode = True  # Move to interaction mode after responding

            else:
                # Try to listen for an activation phrase
                command = listen_for_voice_command()
                if command == "activated":
                    chatbot.speak("Hello! How can I assist you today?")
                    interaction_mode = True
                elif command == "shutdown":
                    break  # Exit the program

        # Interaction Phase: Handle ongoing conversation until "goodbye" is detected
        while interaction_mode:
            command = listen_for_voice_command()

            if command == "shutdown":
                interaction_mode = False
                break  # Exit the program
            elif command == "deactivated":
                interaction_mode = False  # Stop listening and return to monitoring
            elif command == "active":
                continue  # Stay in interaction mode


# Run the main monitoring function
if __name__ == "__main__":
    monitor()
    # Clean up PyAudio resources on exit
    audio.terminate()
