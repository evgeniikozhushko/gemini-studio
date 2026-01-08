const aiButton = document.getElementById("aiButton");
const aiInput = document.getElementById("aiInput");
const aiOutput = document.getElementById("aiOutput");

aiButton.addEventListener("click", function () {
  // Get the input value
  const userInput = aiInput.value.trim();

  // Prevent unwanted API calls
  if (!userInput) return;

  // This prevents users from accidentally sending duplicate requests
  aiButton.disabled = true;

  // User Feedback: Show loading message while waiting for API response
  aiOutput.innerText = "Percolating...";

  const apiKey = "AIzaSyDyrz-Hv5VS3q7OaxwQCDSQPQXWbN9OAX0";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`;

  async function makeRequest(isRetry = false) {
    try {
      const response = await fetch(url, {
        method: "POST", // HTTP method: POST means we're sending data to the server
        headers: {
          "Content-Type": "application/json", // Tell the server we're sending JSON data
        },
        // Request Body: Convert JavaScript object to JSON string
        // JSON.stringify() converts our object into a format the API can understand
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: userInput, // The user's question/prompt
                },
              ],
            },
          ],
        }),
      });

      if (!response.ok) {
        // If we hit a rate limit and haven't retried yet, wait and try again
        if (response.status === 429 && !isRetry) {
          aiOutput.innerText = "Server busy, retrying in 2s...";
          // setTimeout: Schedule a function to run after a delay (2000ms = 2 seconds)
          // This gives the server time to reset its rate limit counter
          setTimeout(() => makeRequest(true), 2000);
          return; // Exit early, don't process this as an error
        }

        throw new Error(
          `Status ${response.status}: Check your quota in Google AI Studio.`
        );
      }

      const data = await response.json();
      console.log("Gemini response:", data);
      
      if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        aiOutput.innerText = data.candidates[0].content.parts[0].text;
      }
    } catch (error) {
      console.error("Error:", error);
      aiOutput.innerText = error.message || "Request failed.";
    } finally {
      if (aiOutput.innerText !== "Server busy, retrying in 2s...") {
        aiButton.disabled = false;
      }
    }
  }

  makeRequest();
});


