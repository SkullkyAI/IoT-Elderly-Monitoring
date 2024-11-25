import speech_recognition as sr
import ChatBot as chatbot

# Initialize speech recognizer
recognizer = sr.Recognizer()

# Activation and shutdown phrases
activation_phrases = ["hello", "hi", "hey", "anna"]
shutdown_phrases = ["turn off device", "shutdown", "power off", "stop listening"]

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
            if any(phrase in user_input for phrase in shutdown_phrases):
                chatbot.speak("Shutting down the device. Goodbye!")
                print("Device shutting down.")
                return "shutdown"

            # Check for activation phrases
            if user_input in activation_phrases:
                chatbot.speak("Hello! How can I assist you today?")
                return "activated"

            # Check for deactivation phrases
            if user_input in chatbot.exit_phrases:
                chatbot.speak("Goodbye! I’ll stop chatting for now.")
                return "deactivated"

            # Pass user input to the chatbot only if already active
            return user_input

        except sr.WaitTimeoutError:
            print("No input detected.")
        except sr.UnknownValueError:
            print("Could not understand audio.")
        except sr.RequestError as e:
            print(f"Request error with Speech Recognition service: {e}")

    return None


def monitor():
    """
    Main monitoring function that continuously listens for commands.
    """
    print("Device is ready. Say 'Hello' to activate or 'Shutdown' to turn off.")
    active = False

    while True:
        command = listen_for_voice_command()

        if command == "shutdown":
            break  # Exit the loop and stop the program
        elif command == "activated":
            active = True
        elif command == "deactivated":
            active = False

        # Only process chatbot interactions if active
        if active and command not in ["shutdown", "activated", "deactivated", None]:
            chatbot.voice_chatbot(command)
        elif not active and command not in ["shutdown", "activated", "deactivated", None]:
            print("Ignored input because the chatbot is not active.")

if __name__ == "__main__":
    monitor()
