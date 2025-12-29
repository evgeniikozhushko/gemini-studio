// Message 
const btn = document.getElementById('myButton');
const input = document.getElementById('content');
const message = document.getElementById('message');

btn.addEventListener('click', function() {
    // Input validation
    const userInput = input.value.trim();
    if (!userInput) {
        alert('Please enter some text!');
        input.focus();
        return;
    }
    
    // Create and append element
    const divElement = document.createElement('div');
    divElement.textContent = userInput;
    divElement.className = 'message-item'; // For CSS styling
    document.body.appendChild(divElement);
    
    // Update message and clear input
    message.textContent = `Added: "${userInput}"`;
    input.value = '';
    input.focus();
});

// Count
const countBtn = document.getElementById('myCount');
const countTotal = document.getElementById('countTotal');
let count = 0;

// Initialize count display
updateCount();

countBtn.addEventListener('click', function() {
    count++;
    updateCount();
});

function updateCount() {
    countTotal.textContent = count;
}

// Colour
const colorChangeBtn = document.getElementById('colorChange');

colorChangeBtn.addEventListener('click', function() {
    const randomColour = generateRandomHSL();
    document.body.style.backgroundColor = randomColour;
    document.body.setAttribute('data-current-color', randomColour); // Store for reference
});

function generateRandomHSL() {
    const hue = Math.floor(Math.random() * 361);
    const saturation = Math.floor(Math.random() * 31 + 70);
    const lightness = Math.floor(Math.random() * 21 + 40);
    
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}