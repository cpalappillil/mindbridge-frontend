import React, { useState } from 'react';
import ChatInput from './ChatInput'; // Adjust this path if ChatInput is defined differently
import fetchGPT4AllResponse from './api'; // Assuming api.js is in the src folder
import axios from 'axios';
import NumericInput from './NumericInput';

function processMessage(message) {
    let idx = message.indexOf(']')
    let name = message.slice(0, idx+1)
    let content = message.slice(idx+1)

    return `${name.replace('[','').replace(']','')}||${content.trim()}`;
}


function ChatApp() {
    axios.defaults.headers.post['Content-Type'] = 'applications/x-www-form-urlencoded';
    const ADDRESS = "http://127.0.0.1:8000";
    const [messages, setMessages] = useState([]);
    const [selectedLanguage, setSelectedLanguage] = useState('English'); // Default language
    const [turnLimit, setTurnLimit] = useState(3);
    const [user, setUser] = useState("Teacher");

    const handleUserChange = (event) => {
      setUser(event.target.value);
    };

    const handleNewMessage = async (newMessage) => {
        if (!newMessage.trim()) return; // Prevent empty messages
        const userMessage = { id: messages.length + 1, text: '['+user+']'+ " " + newMessage, sender: 'user' };
        console.log(userMessage);
        setMessages(messages => [...messages, userMessage]);


    
        try {
          if(messages.length >= turnLimit) {
            console.log("generating course review...");
            let queries = `queries=${processMessage(userMessage.text)}`
            for (let i = messages.length-2; i >= 0; i--) {
              queries += `&queries=${processMessage(messages[i].text)}`;
            }

            axios.get(`${ADDRESS}/rate/?${queries}`, {
              headers: {
                  'Access-Control-Allow-Origin': '*'
              }
          }).then(res0 => {
            let score = res0.data['rate'];
            const botMessageScore = {id: messages.length + 1, text: "[System] " + score, sender: 'bot'};
            setMessages(messages => [...messages, botMessageScore]);
            console.log(score);
            axios.get(`${ADDRESS}/mainpoints/`, {
              headers: {
                'Access-Control-Allow-Origin': '*'
              }
             }).then( res1 => {
               let summary = res1.data['main_points'];
               const botMessageSummary = {id: messages.length + 1, text: "[System] " + summary, sender: 'bot'};
               setMessages(messages => [...messages, botMessageSummary]);
               console.log(summary);
               axios.get(`${ADDRESS}/improvements/?mainpoints=${summary}`, {
                headers: {
                  'Access-Control-Allow-Origin': '*'
                }
               }).then( res2 => {
                 let suggestions = res2.data['improvements'];
                 // console.log({"score": score, "summary": summary, "suggestions": suggestions});
                 const botMessageSuggestions = {id: messages.length + 1, text: "[System] " + suggestions, sender: 'bot'};
                 setMessages(messages => [...messages, botMessageSuggestions]);
               });
            });
        });
          }
            console.log("attempting to get model output");
            if (userMessage.text.startsWith('[Teacher]')) {
                let queries = `queries=${processMessage(userMessage.text)}`;
                for (let i=messages.length-2; i>=0; --i) {
                    if (messages[i].text.startsWith('[Teacher]')) break;
                    queries += `&queries=${processMessage(messages[i].text)}`;
                }
                axios.get(`${ADDRESS}/checksupport/?${queries}`, {
                    headers: {
                        'Access-Control-Allow-Origin': '*'
                    }
                }).then(res => {
                    if (res.data['support']) {
                      axios.get(`${ADDRESS}/extensions/`, {
                        headers: {
                            'Access-Control-Allow-Origin': '*'
                        }
                      }).then(res => {
                        console.log(messages);
                        const botMessage = {id: messages.length + 1, text: "[System] " + res.data["extensions"], sender: 'bot'}
                        setMessages(messages => [...messages, botMessage]);
                        console.log(botMessage);
                      });
                      
                    }
                });
            }
        } catch (error) {
        console.error("Failed to fetch bot response:", error);
        // Here, instead of just logging the error, also add a custom message to the chat log
        const errorMessage = { id: messages.length + 2, text: "I'm sorry, but I can't access my brain right now. Please try again later.", sender: 'bot' };
        setMessages(messages => [...messages, errorMessage]);
        }
    };

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
  };

  return (
    <div>
      <div>
        <label htmlFor="language-select">Language:</label>
        <select id="language-select" value={selectedLanguage} onChange={handleLanguageChange}>
          <option value="English">English</option>
          <option value="Spanish">Spanish</option>
          <option value="French">French</option>
          <option value="Hindi">Hindi</option>
          <option value="Mandarin">Mandarin</option>
        </select>
        <NumericInput
        label="Turn Limit: "
        value={turnLimit}
        setValue={setTurnLimit}
      />
      <div>
      <label htmlFor="dropdown">User: </label>
      <select id="dropdown" value={user} onChange={handleUserChange}>
        <option value="">Select...</option>
        <option value="Teacher">Teacher</option>
        <option value="Student">Student</option>
        {/* Add more options as needed */}
      </select>
    </div>
      </div>
      <ChatInput onSubmit={handleNewMessage} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
  {messages.map((message) => (
    <div key={message.id} style={{
      padding: '10px',
      margin: '5px',
      border: '1px solid #ddd',
      borderRadius: '20px',
      maxWidth: '60%',
      backgroundColor: message.sender === 'bot' ? '#d9fdd3' : '#e7f5ff', // Light green for bot, light blue for user
      marginLeft: message.sender === 'bot' ? '0' : 'auto', // Left align for bot
      marginRight: message.sender === 'bot' ? 'auto' : '0', // Right align for user
    }}>
      {message.text}
    </div>
  ))}
</div>
    </div>
  );
}

export default ChatApp;