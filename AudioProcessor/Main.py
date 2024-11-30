import speech_recognition as sr
from chatBot import Chatbot

# Initialize speech recognizer
recognizer = sr.Recognizer()

# Activation and shutdown phrases
activation_phrases = ["hello", "hi", "hey", "anna"]
shutdown_phrases = ["turn off device", "shutdown", "shut down", "power off", "stop listening"]

def listen_for_voice_command(chatbot: Chatbot):
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
            if any(phrase in user_input for phrase in shutdown_phrases):
                chatbot.speak("Shutting down the device. Goodbye!")
                print("Device shutting down.")
                return "shutdown"

            # Check for activation phrases
            if user_input in activation_phrases:
                chatbot.speak("Hello! How can I assist you today?")
                return "activate"

            # Check for deactivation phrases
            if user_input in chatbot.exit_phrases:
                chatbot.speak("Goodbye! I’ll stop chatting for now.")
                return "deactivate"

            # Pass user input to the chatbot only if already active
            return user_input

        except sr.WaitTimeoutError:
            print("No input detected.")
        except sr.UnknownValueError:
            print("Could not understand audio.")
        except sr.RequestError as e:
            print(f"Request error with Speech Recognition service: {e}")

    return None

stop_commands = ["shutdown"]
activate_commands = ["activate"]
deactivate_commands = ["deactivate"]
total_commands = stop_commands + activate_commands + deactivate_commands + [None]

def main():
    """
    Main monitoring function that continuously listens for commands.
    """
    print(total_commands)

    chatbot = Chatbot()
    active = False

    print("Device is ready. Say 'Hello' to activate or 'Shutdown' to turn off.")

    while True:
        command = listen_for_voice_command(chatbot)
        if command in stop_commands:
            break # Exit de loop and stop the program

        if active:
            if command in deactivate_commands:
                active = False
            if command not in total_commands:
                chatbot.voice_chatbot(command)
        else:
            if command in activate_commands:
                active = True
                chatbot.voice_chatbot(command)
            if command not in total_commands:
                print("Ignored input because the chatbot is not active.")

import os
def test():
    chatbot = Chatbot()
    chatbot.detect_fall(os.path.join("fall_dataset", "fall01.jpg"))

if __name__ == "__main__":
    #main()
    test()
