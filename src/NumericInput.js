import React from 'react';

function NumericInput({ label, value, setValue }) {
  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <div>
      <label>{label}</label>
      <input
        type="number"
        value={value}
        onChange={handleChange}
      />
    </div>
  );
}

export default NumericInput;