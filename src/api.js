const API_BASE = "http://localhost:4891/v1";

// API key setup is skipped since it's not needed for a local LLM

async function fetchGPT4AllResponse() {
    const model = "mistral-7b-instruct-v0.1.Q4_0";
    const prompt = "Who is Michael Jordan?";
    const response = await fetch(`${API_BASE}/completions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // Include the API key in headers if needed
            // 'Authorization': `Bearer ${YOUR_API_KEY_HERE}`,
        },
        body: JSON.stringify({
            model: model,
            prompt: prompt,
            max_tokens: 50,
            temperature: 0.28,
            top_p: 0.95,
            n: 1,
            echo: true,
            stream: false,
        }),
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data); // Adjust based on the actual response structure you expect
}

export default fetchGPT4AllResponse;