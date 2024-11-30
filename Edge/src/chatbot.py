import os
import sys
import asyncio
import requests
from dotenv import load_dotenv
from enum import Enum

import speech_recognition as sr
import google.generativeai as genai
from gtts import gTTS
from PIL import Image

class State(Enum):
    SHUTDOWN = 0
    ACTIVATE = 1
    DEACTIVATE = 2

class Chatbot:
    def __init__(self, queue):
        self.queue = queue
        load_dotenv()
        genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
        self.model = genai.GenerativeModel(model_name='gemini-1.5-flash')

        self.caregiver_context = ("You are a compassionate AI caregiver named Anna, here to assist elderly individuals with companionship, health advice, "
                             "and emotional support. Respond with empathy and attentiveness. If the user expresses distress or asks for help, "
                             "acknowledge this and provide comforting responses. Act as a calm, comforting presence. End conversations warmly if the user decides to leave.")
        
        self.activation_commands = ["hello", "hi", "hey", "anna"]
        self.deactivation_commands = ["goodbye", "bye", "exit", "quit", "see you", "take care", "thanks for the help", "i’m done", "stop", "that will be all", "later"]
        self.shutdown_commands = ["turn off device", "shutdown", "shut down", "power off", "stop listening"]
        self.alert_keywords = ["help", "emergency", "pain", "assist", "hurt", "urgent", "doctor", "need assistance"]

        self.recognizer = sr.Recognizer()

    async def run(self):
        asyncio.create_task(self.process_queue())
        self.active = False
        print("Chatbot: Device is ready. Say 'Hello' to activate or 'Shutdown' to turn off.")

        while True:
            user_input = self.listen_voice()
            state = self.process_input(user_input)
            if state == State.SHUTDOWN:
                print("Chatbot: Shutting down")
                await self.queue.put("STOP")
                break
            
            if self.active:
                if state == State.DEACTIVATE:
                    self.active = False
                    self.speak("Goodbye! I'll stop chatting for now.")
                else:
                    self.voice_chatbot(user_input)
            else:
                if state == State.ACTIVATE:
                    self.active = True
                    self.speak("Hello! How can I assist you today?")

    async def process_queue(self):
        while True:
            message = await self.queue.get()
            if message:
                print("Chatbot: Received notification that an image is ready.")
                fall = self.detect_fall(message)
                print(f"Chatbot: Did them fall? {fall}")
            elif message == "STOP":
                print("Chatbot: Stopping chatbot.")
                break

    def listen_voice(self):
        with sr.Microphone as source:
            self.recognizer.adjust_for_ambient_noise(source)
            try:
                audio_data = self.recognizer.listen(source, timeout=5)
                user_input = self.recognizer.recognize_google(audio_data).lower()
                print(f"Chatbot: You said: {user_input}")
            
            except sr.WaitTimeoutError:
                print("Chatbot: No input detected.")
            except sr.UnknownValueError:
                print("Chatbot: Could not understand audio.")
            except sr.RequestError as e:
                print(f"Chatbot: Request error with Speech Recognition service: {e}")

        return user_input

    def process_input(self, user_input):
        if any(phrase in user_input for phrase in self.shut):
            return State.SHUTDOWN
        elif user_input in self.activation_commands:
            return State.ACTIVATE
        elif user_input in self.deactivation_commands:
            return State.DEACTIVATE

    def send_help_alert(self):
        """
        Sends a help alert to the connected Angular web app.
        """
        try:
            # Replace with your actual endpoint URL
            response = requests.post("http://localhost:4200/api/help-alert", json={"alert": "User needs help!"})
            if response.status_code == 200:
                print("Help alert sent to web app.")
            else:
                print("Failed to send help alert. Status code:", response.status_code)
        except requests.exceptions.RequestException as e:
            print("Error sending help alert:", e)

    # Method to synthesize and play speech, also prints to console
    def speak(self, text):
        """
        Converts text to speech, plays it aloud, and prints it to the console.
        """
        print("AI Caregiver Assistant:", text)  # Console output
        tts = gTTS(text=text, lang='en')
        tts.save("response.mp3")
        if sys.platform == 'win32':
            os.system("start response.mp3")
        else:
            os.system("mpg123 response.mp3")

    # Method to generate a response from Gemini API
    def generate_response(self, user_input):
        prompt = self.caregiver_context + "\nUser: " + user_input + "\nCaregiver:"
        response = self.model.generate_content(prompt)

        try:
            return response.candidates[0].content.parts[0].text.strip()
        except (IndexError, AttributeError) as e:
            print("Error extracting response text:", e)
            return "I'm here to help. Could you please repeat that?"

    # Voice-based chatbot that detects when the user needs help
    def voice_chatbot(self, user_input):
        # Check if the input contains a help request and send alert if needed
        if any(keyword in user_input for keyword in self.alert_keywords):
            self.send_help_alert()
            self.speak("It sounds like you need urgent assistance. I have notified a caregiver.")
            return

        # Generate response from the AI model and speak it
        response_text = self.generate_response(user_input)
        self.speak(response_text)
        return response_text

    def detect_fall(self, image_path):
        sample_file = Image.open(image_path)

        prompt = [sample_file,
                  "Detect if the person in the image has fallen or not.",
                  "Always respond with a single word: 'Yes' or 'No'."]
        response = self.model.generate_content(prompt)
        try:
            return response.candidates[0].content.parts[0].text.strip()
        except (IndexError, AttributeError) as e:
            print("Error extracting response text:", e)
            return "I'm here to help, Could you please repeat that?"
