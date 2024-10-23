const API_URL = 'https://baconipsum.com/api/?type=meat-and-filler';

const quotesection = document.getElementById("quoteSection");
const userInput = document.getElementById("userInput");

let quote = "";
let time = 60;
let timer = null;
let mistakes = 0;


const renderNewQuote = async () => {
  const response = await fetch(API_URL);
  const data = await response.json();
  quote = data[0]; 

  let arr = quote.split("").map((char) => {
    return `<span class='quote-chars'>${char}</span>`;
  });
  quotesection.innerHTML = arr.join("");
};

userInput.addEventListener("input", () => {
  let quoteChars = document.querySelectorAll(".quote-chars");
  let userInputChars = userInput.value.split("");

  quoteChars.forEach((char, index) => {
    if (char.innerText === userInputChars[index]) {
      char.classList.add("success");
      char.classList.remove("fail");
    } else if (userInputChars[index] == null) {
      char.classList.remove("success", "fail");
    } else {
      mistakes++;
      char.classList.add("fail");
    }
  });

  document.getElementById("mistakes").innerText = mistakes;
});

function updateTimer() {
  if (time === 0) {
    stopTest();
  } else {
    document.getElementById("timer").innerText = --time + "s";
  }
}

const timeReduce = () => {
  timer = setInterval(updateTimer, 1000);
};


const displayResult = () => {
  clearInterval(timer);
  document.querySelector(".result").style.display = "block";
  userInput.disabled = true;

  let timeTaken = (60 - time) / 60;
  let wpm = Math.round((userInput.value.length / 5) / timeTaken);
  document.getElementById("wpm").innerText = wpm;
  let totalCharactersTyped = userInput.value.length;
  
  let correctCharacters = totalCharactersTyped - mistakes;
  if (correctCharacters < 0) correctCharacters = 0; 
  
  let accuracy = Math.round((correctCharacters / totalCharactersTyped) * 100);
  document.getElementById("accuracy").innerText = accuracy + "%";
};

const startTest = () => {
  mistakes = 0;
  time = 60;
  userInput.disabled = false;
  userInput.value = "";
  document.getElementById("startTest").style.display = "none";
  document.getElementById("stopTest").style.display = "inline-block";
  renderNewQuote();
  timeReduce();
};

const stopTest = () => {
  clearInterval(timer);
  document.getElementById("stopTest").style.display = "none";
  userInput.disabled = true;
};


const resetTest = () => {
  clearInterval(timer);
  userInput.value = "";
  document.getElementById("startTest").style.display = "inline-block";
  document.getElementById("stopTest").style.display = "none";
  document.querySelector(".result").style.display = "none";
  userInput.disabled = true;
  time = 60;
  mistakes = 0;
  document.getElementById("timer").innerText = "60s";
};


document.getElementById("startTest").addEventListener("click", startTest);
document.getElementById("stopTest").addEventListener("click", stopTest);
document.getElementById("resetTest").addEventListener("click", resetTest);
document.getElementById("cheakSpeed").addEventListener("click", displayResult);

window.onload = () => {
  userInput.value = "";
  document.getElementById("startTest").style.display = "inline-block";
  document.getElementById("stopTest").style.display = "none";
  userInput.disabled = true;
};
