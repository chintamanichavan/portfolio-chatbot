# server.py

from flask import Flask, request, jsonify
from chatterbot import ChatBot
from chatterbot.trainers import ChatterBotCorpusTrainer

app = Flask(__name__)

# Create a chatbot instance
chatbot = ChatBot('My Chatbot')

# Training the chatbot with an example dataset
trainer = ChatterBotCorpusTrainer(chatbot)
trainer.train('chatterbot.corpus.english')

# Generate a response from the chatbot
def get_chatbot_response(message):
    response = chatbot.get_response(message)
    return response.text

@app.route('/chatbot', methods=['POST'])
def chatbot():
    user_message = request.json['message']
    response = get_chatbot_response(user_message)
    return jsonify({'message': response})

if __name__ == '__main__':
    app.run()
