import React from 'react';

function ChatInput({ onSubmit }) {
  const [userInput, setUserInput] = React.useState('');

  const handleChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(userInput);
    setUserInput(''); // Clear the input field after submission
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={userInput}
        onChange={handleChange}
        placeholder="Type your message here..."
      />
      <button type="submit">Submit</button>
    </form>
  );
}

export default ChatInput;