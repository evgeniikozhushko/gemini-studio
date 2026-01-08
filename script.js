// curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent" \
//   -H 'Content-Type: application/json' \
//   -H 'X-goog-api-key: AIzaSyDyrz-Hv5VS3q7OaxwQCDSQPQXWbN9OAX0' \
//   -X POST \
//   -d '{
//     "contents": [
//       {
//         "parts": [
//           {
//             "text": "Explain how AI works in a few words"
//           }
//         ]
//       }
//     ]
//   }'

// import { GoogleGenAI } from "@google/genai";
// The client gets the API key from the environment variable `GEMINI_API_KEY`.
// const ai = new GoogleGenAI({});

// Message
// const btn = document.getElementById('myButton');
// const input = document.getElementById('content');
// const message = document.getElementById('message');

// btn.addEventListener('click', function() {
//     // Input validation
//     const userInput = input.value.trim();
//     if (!userInput) {
//         alert('Please enter some text!');
//         input.focus();
//         return;
//     }

//     // Create and append element
//     const divElement = document.createElement('div');
//     divElement.textContent = userInput;
//     divElement.className = 'message-item'; // For CSS styling
//     document.body.appendChild(divElement);

//     // Update message and clear input
//     message.textContent = `Added: "${userInput}"`;
//     input.value = '';
//     input.focus();
// });

// Count
// const countBtn = document.getElementById('myCount');
// const countTotal = document.getElementById('countTotal');
// let count = 0;

// Initialize count display
// updateCount();

// countBtn.addEventListener('click', function() {
//     count++;
//     updateCount();
// });

// function updateCount() {
//     countTotal.textContent = count;
// }

// Colour
// const colorChangeBtn = document.getElementById('colorChange');

// colorChangeBtn.addEventListener('click', function() {
//     const randomColour = generateRandomHSL();
//     document.body.style.backgroundColor = randomColour;
//     document.body.setAttribute('data-current-color', randomColour); // Store for reference
// });

// function generateRandomHSL() {
//     const hue = Math.floor(Math.random() * 361);
//     const saturation = Math.floor(Math.random() * 31 + 70);
//     const lightness = Math.floor(Math.random() * 21 + 40);

//     return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
// }

// AI function

// DOM Element Selection: Get references to HTML elements by their IDs
// These elements are defined in index.html and allow us to interact with the page
const aiButton = document.getElementById("aiResponse"); // The button that triggers the AI request
const aiInput = document.getElementById("aiContent"); // The input field where user types their question
const aiOutput = document.getElementById("aiOutput"); // The paragraph element that displays the AI response

// Event Listener: Wait for user to click the AI button
// When clicked, this function will execute
aiButton.addEventListener("click", function () {
  // Get the text the user typed in the input field
  const textInput = aiInput.value;

  // Guard clause: If input is empty, exit early (don't make unnecessary API calls)
  if (!textInput) return;

  // UI State Management: Disable button to prevent multiple simultaneous requests
  // This prevents users from accidentally sending duplicate requests
  aiButton.disabled = true;

  // User Feedback: Show loading message while waiting for API response
  aiOutput.innerText = "Thinking...";

  // API Configuration: Store the API key and construct the full URL
  // The API key authenticates your request with Google's servers
  const apiKey = "AIzaSyDyrz-Hv5VS3q7OaxwQCDSQPQXWbN9OAX0";

  // Template Literal: Build the API endpoint URL with the key as a query parameter
  // Template literals (backticks) allow us to insert variables using ${variable}
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`;

  // Function Declaration: Define a reusable function to make the API request
  // isRetry parameter tracks if this is a retry attempt (for handling rate limits)
  function makeRequest(isRetry = false) {
    // Fetch API: Make an HTTP POST request to the Google Gemini API
    // fetch() returns a Promise - an object representing an asynchronous operation
    window
      .fetch(url, {
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
                  text: textInput, // The user's question/prompt
                },
              ],
            },
          ],
        }),
      })
      // Promise Chain - .then(): Handle the response when it arrives
      // The fetch API returns a Response object, not the actual data yet
      .then((response) => {
        // Response Status Check: Verify the request was successful
        // response.ok is true for status codes 200-299, false otherwise
        if (!response.ok) {
          // Rate Limit Handling: 429 means "Too Many Requests"
          // If we hit a rate limit and haven't retried yet, wait and try again
          if (response.status === 429 && !isRetry) {
            aiOutput.innerText = "Server busy, retrying in 2s...";
            // setTimeout: Schedule a function to run after a delay (2000ms = 2 seconds)
            // This gives the server time to reset its rate limit counter
            setTimeout(() => makeRequest(true), 2000);
            return; // Exit early, don't process this as an error
          }
          // Error Throwing: Create and throw an Error object for other failures
          // This will be caught by the .catch() block below
          throw new Error(
            `Status ${response.status}: Check your quota in Google AI Studio.`
          );
        }
        // JSON Parsing: Convert the response body from JSON string to JavaScript object
        // response.json() also returns a Promise, so we chain another .then()
        return response.json();
      })
      // Second Promise Chain - .then(): Process the parsed JSON data
      .then((json) => {
        // Data Extraction: Navigate the nested JSON structure to get the AI's response
        // json.candidates[0] = first response candidate
        // .content.parts[0] = first content part
        // .text = the actual text response
        if (json && json.candidates) {
          aiOutput.innerText = json.candidates[0].content.parts[0].text;
        }
      })
      // Error Handling - .catch(): Handle any errors that occurred in the promise chain
      // This catches network errors, parsing errors, or thrown errors from above
      .catch((error) => {
        // Console Logging: Output error details to browser console for debugging
        console.error("Error:", error);
        // User Feedback: Display error message to the user
        aiOutput.innerText = error.message;
      })
      // Cleanup - .finally(): Always runs, whether the request succeeded or failed
      // This ensures the button gets re-enabled even if an error occurred
      .finally(() => {
        // Conditional Re-enable: Only re-enable button if we're not in retry mode
        // This prevents the button from being enabled during the 2-second retry wait
        if (aiOutput.innerText !== "Server busy, retrying in 2s...") {
          aiButton.disabled = false;
        }
      });
  }

  // Function Call: Execute the makeRequest function to start the API call
  makeRequest();
});
