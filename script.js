const RANDOM_QUOTE_API = 'https://api.quotable.io/random';
const quoteDisplayElement = document.getElementById('quoteDisplay');
const quoteInputElement = document.getElementById('quoteInput');
const timerElement = document.getElementById('timer');
const newTestButton = document.getElementById('newTestButton');
const wpmElement = document.getElementById('wpm');  

let timerStarted = false;  // Flag to observe timer
let timerInterval;         // handling interval ID
let correctKeystrokes = 0; //count of....

quoteInputElement.addEventListener('input', () => {
    const arrayQuote = quoteDisplayElement.querySelectorAll('span');
    const arrayValue = quoteInputElement.value.split('');
    let correct = true;

    // Starting the timer on the first keystroke
    if (!timerStarted) {
        startTimer();
        timerStarted = true;
    }

    arrayQuote.forEach((characterSpan, index) => {
        const character = arrayValue[index];

        if (character == null) {
            characterSpan.classList.remove('correct');
            characterSpan.classList.remove('incorrect');
            correct = false;
        } else if (character === characterSpan.innerText) {
            characterSpan.classList.add('correct');
            characterSpan.classList.remove('incorrect');
            correctKeystrokes++; 
        } else {
            characterSpan.classList.add('incorrect');
            characterSpan.classList.remove('correct');
            correct = false;
        }
    });

    
    if (correct) {
        stopTimer();
        // renderNextQuote();
    }
});

newTestButton.addEventListener('click', () => {
    resetTimer();   
    renderNextQuote();
});

function getRandomQuote() {
    return fetch(RANDOM_QUOTE_API)
        .then(response => response.json())
        .then(data => data.content);
}

async function renderNextQuote() {
    const quote = await getRandomQuote();
    quoteDisplayElement.innerHTML = '';
    correctKeystrokes = 0;  

    quote.split('').forEach(character => {
        const characterSpan = document.createElement('span');
        characterSpan.innerText = character;
        quoteDisplayElement.appendChild(characterSpan);
    });

    quoteInputElement.value = null;
    timerStarted = false;  // Reset the flag
}

let startTime;
function startTimer() {
    startTime = new Date();
    timerInterval = setInterval(() => {
        timerElement.innerText = getTimerTime();
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);  // Stop the timer
    const timeTaken = getTimerTime(); 

    // division by zero handling
    if (timeTaken > 0) {
        const wordsTyped = correctKeystrokes / 5;  //1 word = 5 keystrokes
        const wpm = Math.floor((wordsTyped / timeTaken) * 60);  
        wpmElement.innerText = `WPM: ${wpm}`;  
    } else {
        wpmElement.innerText = "WPM: 0"; 
    }
}


function resetTimer() {
    clearInterval(timerInterval);  // Clear the existing timer interval
    timerElement.innerText = 0;    // Reset the timer display to 0
    wpmElement.innerText = "WPM: 0";  // Reset the WPM display
    timerStarted = false;          // Reset the timer flag
}

function getTimerTime() {
    return Math.floor((new Date() - startTime) / 1000);
}

renderNextQuote();
