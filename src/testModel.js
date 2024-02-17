async function testGPT4All(prompt) {
  try {
    const response = await fetch('http://localhost:4891/v1/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: "mistral-7b-instruct-v0.1.Q4_0",
        prompt: prompt,
        max_tokens: 50,
        temperature: 0.5,
      }),
    });

    const data = await response.json();
    console.log("Response:", data);
  } catch (error) {
    console.error("Failed to fetch response:", error);
  }
  return data;
}

testGPT4All("Hello");