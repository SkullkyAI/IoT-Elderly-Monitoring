import google.generativeai as genai
import os
from gtts import gTTS
import sys
import requests
from PIL import Image
from dotenv import load_dotenv

class Chatbot:
    def __init__(self):
        load_dotenv()
        genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

        # Initialize the Gemini model
        self.model = genai.GenerativeModel(model_name='gemini-1.5-flash')

        # Define the caregiver context
        self.caregiver_context = ("You are a compassionate AI caregiver named Anna, here to assist elderly individuals with companionship, health advice, "
                             "and emotional support. Respond with empathy and attentiveness. If the user expresses distress or asks for help, "
                             "acknowledge this and provide comforting responses. Act as a calm, comforting presence. End conversations warmly if the user decides to leave.")
        
        # Alert and exit phrases
        self.alert_keywords = ["help", "emergency", "pain", "assist", "hurt", "urgent", "doctor", "need assistance"]
        self.exit_phrases = ["goodbye", "bye", "exit", "quit", "see you", "take care", "thanks for the help", "i’m done", "stop", "that will be all", "later"]
        self.greeting_phrases = ["hello", "hi", "hey", "start chatting", "anna"]
    
    # Function to send help alert to Angular web app
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
            print(response.candidates[0].content.parts[0].text.strip())
        except (IndexError, AttributeError) as e:
            print("Error extracting response text:", e)
            return "I'm here to help, Could you please repeat that?"
