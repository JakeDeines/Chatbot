import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Chatbot.css'; // Import the CSS file
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUser, faRobot } from '@fortawesome/free-solid-svg-icons';

function Chatbot() {
  const [userQuestion, setUserQuestion] = useState('');
  const [conversation, setConversation] = useState([]);
  const [error, setError] = useState('');

  const askQuestion = async () => {
    if (!userQuestion) {
      setError('Please ask a question.');
      return;
    }

    try {
      setError(''); // Clear any previous error message

      // Prepare the conversation messages
      const messages = [
        ...conversation.flatMap((entry) => [
          { role: 'user', content: entry.user },
          { role: 'assistant', content: entry.chatbot }
        ]),
        { role: 'user', content: userQuestion }
      ];

      // Make a call to OpenAI API (GPT-3.5)
      const openaiResponse = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo', // Using GPT-3.5
          messages: messages,
          max_tokens: 200,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          },
        }
      );

      const chatbotResponse = openaiResponse.data.choices[0].message.content;

      // Update the conversation history with the new entry
      const newEntry = {
        user: userQuestion,
        chatbot: chatbotResponse,
      };
      setConversation([...conversation, newEntry]);

      // Clear the user's input field
      setUserQuestion('');
    } catch (error) {
      if (error.response?.status === 429) {
        setError('You are making too many requests. Please wait a moment and try again.');
      } else {
        setError('An error occurred. Please try again later.');
      }
      console.error('Error:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      askQuestion();
    }
  };

  return (
    <div className="container-center">
      <div className="conversation-history">
        {conversation.map((entry, index) => (
          <div key={index} className="conversation-entry">
            <div className="card">
              <div className="user-response">
                <FontAwesomeIcon icon={faUser} className="icon" />
                {entry.user}
              </div>
              <div className="chatbot-response">
                <FontAwesomeIcon icon={faRobot} className="icon" />
                {entry.chatbot}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="user-input">
        <input
          type="text"
          value={userQuestion}
          onChange={(e) => setUserQuestion(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={error || "Type your question here"}
          className={`wider-input ${error ? 'error-border' : ''}`} // Add error-border class when error is present
        />
        <FontAwesomeIcon
          icon={faSearch}
          className="search-icon"
          onClick={askQuestion}
        />
      </div>
    </div>
  );
}

export default Chatbot;
