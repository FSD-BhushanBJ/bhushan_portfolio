// QUIZ GAME (Beginner-Friendly Version)
// =======================================

// --- All questions for each difficulty level ---
var allQuizData = {
    easy: [
        { question: "What does HTML stand for?", options: ["Hyper Text Markup Language", "Home Tool Markup Language", "Hyperlinks and Text Markup Language", "High Tech Modern Language"], answer: 0, hint: "It's related to the structure of web pages." },
        { question: "What does CSS stand for?", options: ["Colorful Style Sheets", "Cascading Style Sheets", "Creative Style Sheets", "Computer Style Sheets"], answer: 1, hint: "It's about styling web pages in a cascading manner." },
        { question: "Which HTML tag is used to create a table?", options: ["table", "tr", "td", "tbody"], answer: 0, hint: "This tag wraps the entire table structure." },
        { question: "Which HTML attribute is used to link an external CSS file?", options: ["src", "href", "link", "style"], answer: 1, hint: "It is used inside the <link> tag to point to the CSS file." },
        { question: "Which symbol is used for comments in JavaScript?", options: ["//", "/* */", "!-- --", "#"], answer: 0, hint: "It's a double character that starts a single-line comment." }
    ],

    medium: [
        { question: "Which CSS property is used to make text bold?", options: ["font-weight", "text-style", "font-style", "text-weight"], answer: 0, hint: "This property controls how thick or thin characters appear." },
        { question: "What does the 'z-index' property do in CSS?", options: ["Sets text direction", "Controls element stacking order", "Adjusts element zoom level", "Sets horizontal alignment"], answer: 1, hint: "It's related to how elements stack on top of each other." },
        { question: "Which JavaScript method is used to remove the last element from an array?", options: ["pop()", "push()", "shift()", "unshift()"], answer: 0, hint: "Think of 'popping' a balloon - something is removed." },
        { question: "Which JavaScript operator is used to assign a value to a variable?", options: ["=", "==", "===", ":="], answer: 0, hint: "It’s the basic assignment operator." },
        { question: "Which CSS property is used to create space inside an element between content and border?", options: ["padding", "margin", "spacing", "gap"], answer: 0, hint: "It is internal spacing, not outside the element." }
    ],

    hard: [
        { question: "What is the output of: console.log(typeof typeof 1)?", options: ["number", "string", "undefined", "NaN"], answer: 1, hint: "The typeof operator returns a string indicating the type." },
        { question: "Which CSS property can be used to create a grid layout?", options: ["display: grid", "display: flex", "position: grid", "layout: grid"], answer: 0, hint: "It's used for two-dimensional layouts." },
        { question: "What is a closure in JavaScript?", options: ["A way to close browser windows", "A function that has access to variables from an outer function scope", "A method to end JavaScript execution", "A way to close HTML tags"], answer: 1, hint: "It's about scope and memory." },
        { question: "Which JavaScript array method creates a new array with elements that pass a test?", options: ["filter()", "map()", "reduce()", "forEach()"], answer: 0, hint: "It ‘filters’ elements based on a condition." },
        { question: "What does the CSS 'calc()' function allow you to do?", options: ["Perform calculations to determine CSS property values", "Calculate HTML element size automatically", "Determine JavaScript variable values", "Animate elements"], answer: 0, hint: "It combines units like %, px, em in expressions." }
    ]
};

// --- Game Variables ---
let quizData = [];       // Current quiz questions (based on difficulty)
const totalQuestions = 5; // Total number of questions
let currentQuestion = 0; // Current question index
let score = 0;           // Player score
let userName = "";       // User name
let userAvatar = "👩‍💻"; // Default avatar
let difficulty = "easy"; // Default difficulty

let timer;               // Timer variable
let timeLeft = 20;       // Time per question
let answered = false;    // Track if user answered

let streak = 0;          // Correct answer streak
let wrongAnswers = 0;    // Incorrect answer count

let fiftyUsed = false;
let hintUsed = false;
let skipUsed = false;

let startTime;           // For total time tracking
let totalTime = 0;

// =======================================
// SELECT AVATAR
// =======================================
function selectAvatar(element) {
  var avatars = document.getElementsByClassName("avatar");

  for (var i = 0; i < avatars.length; i++) {
    var avatar = avatars[i];
    avatar.className = avatar.className.replace(" selected", "");
  }
  element.className += " selected";
 
  userAvatar = element.getAttribute("data-avatar");
  alert("You selected this Avatar: " + userAvatar);0
}



// =======================================
// SELECT DIFFICULTY
// =======================================
function selectDifficulty(element) {
  var buttons = document.getElementsByClassName("difficulty-option");
  for (var i = 0; i < buttons.length; i++) {
    var btn = buttons[i];
    btn.className = btn.className.replace(" selected", "");
  }
  element.className += " selected";
  difficulty = element.getAttribute("data-difficulty");
  alert("You selected : " + difficulty + " level");
}


// =======================================
// PAGE SWITCHING (Home / Quiz / Score)
// =======================================
function showPage(id) {
  var pages = document.getElementsByClassName("page");
  for (var i = 0; i < pages.length; i++) {
    pages[i].classList.remove("active");
  }
  var pageToShow = document.getElementById(id);
  pageToShow.classList.add("active");
}


// =======================================
// START QUIZ
// =======================================
function startQuiz() {
  // Get username value
  var input = document.getElementById("username");
  userName = input.value.trim();

  // Check if username is entered
  if (userName === "") {
    input.style.borderColor = "red";
    input.classList.add("shake");

    // Remove shake effect after 0.5 second
    setTimeout(function() {
      input.classList.remove("shake");
    }, 500);
    return; // Stop here if no username
  }

  // Reset game values
  currentQuestion = 0;
  score = 0;
  streak = 0;
  wrongAnswers = 0;
  fiftyUsed = false;
  hintUsed = false;
  skipUsed = false;

  // Load quiz data based on difficulty
  quizData = allQuizData[difficulty];

  // Show quiz page
  showPage("quizPage");

  // Update player name, avatar, and total questions
  document.getElementById("displayName").textContent = userName;
  document.getElementById("userAvatar").textContent = userAvatar;
  document.getElementById("totalQuestions").textContent = quizData.length;

  // Hide streak badge
  document.getElementById("streakBadge").style.display = "none";

  // Reset special buttons (fiftyFifty, hint, skip)
  var buttonIds = ["fiftyFifty", "hint", "skipQuestion"];
  for (var i = 0; i < buttonIds.length; i++) {
    document.getElementById(buttonIds[i]).classList.remove("used");
  }

  // Start quiz timer and load first question
  startTime = new Date();
  loadQuestion();
  startTimer();
}


// =======================================
// LOAD QUESTION
// =======================================
function loadQuestion() {
  // Check if all questions are done
  if (currentQuestion >= quizData.length) {
    endQuiz();
    return;
  }

  answered = false;
  var q = quizData[currentQuestion]; // current question data

  // Update question number and text
  document.getElementById("currentQuestionNum").textContent = currentQuestion + 1;
  document.getElementById("question").textContent = q.question;

  // Get options area and clear it
  var optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";

  // Letters for options (A, B, C, D)
  var letters = ["A", "B", "C", "D"];

  // Create and show each option
  for (var i = 0; i < q.options.length; i++) {
    var div = document.createElement("div");
    div.className = "option";
    div.style.pointerEvents = "auto"; // enable clicking

    // Set inner content manually (without template strings)
    div.innerHTML =
      "<div class='option-letter'>" + letters[i] + "</div>" +
      "<div class='option-text'>" + q.options[i] + "</div>";

    // When user clicks an option
    div.onclick = (function(index) {
      return function() {
        selectOption(index);
      };
    })(i);

    // Add option to the options area
    optionsDiv.appendChild(div);
  }

  // Hide next button, feedback, and hint
  document.getElementById("nextButton").style.display = "none";
  document.getElementById("feedbackMessage").style.display = "none";
  document.getElementById("hintBox").style.display = "none";

  // Start fresh timer
  resetTimer();
}



// =======================================
// WHEN USER SELECTS AN OPTION
// =======================================
function selectOption(i) {
  // Stop if already answered
  if (answered) {
    return;
  }

  answered = true;
  clearInterval(timer);

  var correct = quizData[currentQuestion].answer; // correct answer index
  var options = document.getElementsByClassName("option"); // all options
  var msg = document.getElementById("feedbackMessage");

  // Disable all options and mark correct/incorrect ones
  for (var index = 0; index < options.length; index++) {
    options[index].style.pointerEvents = "none"; // disable clicks

    if (index === i) {
      options[index].classList.add("selected");
    }

    if (index === correct) {
      options[index].classList.add("correct");
    } else if (index === i && index !== correct) {
      options[index].classList.add("incorrect");
    }
  }

  // If user selected correct option
  if (i === correct) {
    msg.textContent = "Correct! 🎉";
    msg.className = "feedback correct";
    score++;
    streak++;

    // Show streak badge if streak >= 3
    if (streak >= 3) {
      var badge = document.getElementById("streakBadge");
      badge.textContent = "🔥 " + streak + " streak";
      badge.style.display = "inline-block";
    }

  } else {
    // If user selected wrong option
    msg.textContent =
      "Incorrect! The correct answer is " +
      options[correct].getElementsByClassName("option-text")[0].textContent;
    msg.className = "feedback incorrect";
    streak = 0;
    wrongAnswers++;
    document.getElementById("streakBadge").style.display = "none";
  }

  // Show feedback and next button
  msg.style.display = "block";
  document.getElementById("nextButton").style.display = "block";
}



// =======================================
// LIFELINE: 50-50
// =======================================
function useFiftyFifty() {
  // Stop if already used or question is answered
  if (fiftyUsed || answered) {
    return;
  }

  fiftyUsed = true;
  document.getElementById("fiftyFifty").classList.add("used");

  // Get correct answer index
  var correct = quizData[currentQuestion].answer;

  // Get all option elements
  var options = document.getElementsByClassName("option");
  var wrongIndexes = [];

  // Find wrong option indexes
  for (var i = 0; i < options.length; i++) {
    if (i !== correct) {
      wrongIndexes.push(i);
    }
  }

  // Shuffle wrongIndexes manually (simple beginner way)
  for (var j = wrongIndexes.length - 1; j > 0; j--) {
    var randomIndex = Math.floor(Math.random() * (j + 1));
    var temp = wrongIndexes[j];
    wrongIndexes[j] = wrongIndexes[randomIndex];
    wrongIndexes[randomIndex] = temp;
  }

  // Hide 2 wrong options
  for (var k = 0; k < 2; k++) {
    var wrongOption = options[wrongIndexes[k]];
    wrongOption.style.opacity = "0.3";
    wrongOption.style.pointerEvents = "none";
  }
}



// =======================================
// LIFELINE: HINT
// =======================================
function useHint() {
  // Stop if hint already used or question already answered
  if (hintUsed || answered) {
    return;
  }

  // Mark hint as used
  hintUsed = true;
  document.getElementById("hint").classList.add("used");

  // Show hint text box
  var hintBox = document.getElementById("hintBox");
  var currentHint = quizData[currentQuestion].hint;

  // Display the hint
  hintBox.textContent = currentHint;
  hintBox.style.display = "block";
}


// =======================================
// LIFELINE: SKIP
// =======================================
function useSkip() {
  // Stop if skip already used or question is already answered
  if (skipUsed || answered) {
    return;
  }

  // Mark skip as used
  skipUsed = true;
  document.getElementById("skipQuestion").classList.add("used");

  // Move to the next question
  nextQuestion();
}


// =======================================
// NEXT QUESTION
// =======================================

function nextQuestion() {
  // Move to the next question
  currentQuestion = currentQuestion + 1;

  // Check if there are still questions left
  if (currentQuestion < quizData.length) {
    answered = false; // allow answering again
    loadQuestion();   // load next question
    resetTimer();     // restart timer
    resetOptions();   // clear old highlights

    // Hide next button again
    document.getElementById("nextButton").style.display = "none";
  } else {
    // If no more questions, end the quiz
    endQuiz();
  }
}


function resetOptions() {
  // Get all option elements
  var options = document.getElementsByClassName("option");

  // Remove old styles and enable clicking again
  for (var i = 0; i < options.length; i++) {
    options[i].classList.remove("correct");
    options[i].classList.remove("incorrect");
    options[i].style.pointerEvents = "auto";
  }

  // Hide old feedback message
  var feedback = document.getElementById("feedbackMessage");
  feedback.style.display = "none";
}




// =======================================
// TIMER FUNCTIONS
// =======================================
function startTimer() {
  // Stop any previous timer
  clearInterval(timer);

  // Set time based on difficulty level
  if (difficulty === "easy") {
    timeLeft = 20;
  } else if (difficulty === "medium") {
    timeLeft = 15;
  } else {
    timeLeft = 10;
  }

  // Show the starting time
  updateTimer();

  // Start a new timer that runs every 1 second
  timer = setInterval(function() {
    timeLeft = timeLeft - 1; // reduce time
    updateTimer(); // update display

    // If time is over, stop timer and handle timeout
    if (timeLeft <= 0) {
      clearInterval(timer);
      handleTimeUp();
    }
  }, 1000);
}


function handleTimeUp() {
  // Check if user hasn't answered yet
  if (!answered) {
    var msg = document.getElementById("feedbackMessage");
    msg.textContent = "Time's up!";
    msg.className = "feedback incorrect";
    msg.style.display = "block";

    // Show which option was correct
    var correct = quizData[currentQuestion].answer;
    var options = document.getElementsByClassName("option");
    options[correct].classList.add("correct");

    // Reset streak and count wrong answer
    streak = 0;
    wrongAnswers++;

    // Hide streak badge
    document.getElementById("streakBadge").style.display = "none";

    // Mark question as answered and show next button
    answered = true;
    document.getElementById("nextButton").style.display = "block";
  }
}



function resetTimer() {
  // Stop any old timer
  clearInterval(timer);

  // Set timer value based on difficulty
  if (difficulty === "easy") {
    timeLeft = 20;
  } else if (difficulty === "medium") {
    timeLeft = 15;
  } else {
    timeLeft = 10;
  }

  // Update timer display right away
  updateTimer();

  // Start a new timer that counts down every 1 second
  timer = setInterval(function() {
    timeLeft = timeLeft - 1; // decrease time
    updateTimer(); // show remaining time

    // If time runs out, stop timer and handle timeout
    if (timeLeft <= 0) {
      clearInterval(timer);
      handleTimeUp();
    }
  }, 1000);
}




function updateTimer() {
    // find the timer text area on the page
    let timerText = document.getElementById("timer");

    // show how many seconds are left
    timerText.textContent = timeLeft + " seconds";

    // if time is 5 or less, show text in red color
    if (timeLeft <= 5) {
        timerText.style.color = "red";
    } else {
        timerText.style.color = "#ff4757"; // normal color
    }
}


// =======================================
// END QUIZ
// =======================================
function endQuiz() {
    // stop the timer
    clearInterval(timer);

    // show the score page
    showPage("scorePage");

    // calculate total time taken
    let endTime = new Date(); // get the current time
    totalTime = Math.round((endTime - startTime) / 1000); // convert milliseconds to seconds

    // calculate percentage score
    let percent = Math.round((score / quizData.length) * 100);

    // show score details on the page
    document.getElementById("scoreText").textContent = percent + "%";
    document.getElementById("finalScore").textContent = "Your Score: " + score + "/" + quizData.length;
    document.getElementById("correctAnswers").textContent = score;
    document.getElementById("incorrectAnswers").textContent = wrongAnswers;
    document.getElementById("timeUsed").textContent = formatTime(totalTime);

    // make a message based on performance
    let message = "";
    if (percent >= 80) {
        message = "Excellent! You're a coding genius! 🏆";
        makeConfetti(); // show celebration effect
    } else if (percent >= 60) {
        message = "Good job! 👍";
    } else if (percent >= 40) {
        message = "Not bad! Keep learning!";
    } else {
        message = "Keep practicing! 💪";
    }

    // show message on the screen
    document.getElementById("scoreMsg").textContent = message;
}


// =======================================
// HELPER FUNCTIONS
// =======================================
function formatTime(seconds) {
    // find how many full minutes are there
    let mins = Math.floor(seconds / 60);

    // find how many seconds are left after removing full minutes
    let secs = seconds % 60;

    // if seconds are less than 10, add a "0" before it (example: 05 instead of 5)
    if (secs < 10) {
        secs = "0" + secs;
    }

    // return in "minutes:seconds" format
    return mins + ":" + secs;
}


function makeConfetti() {
    // create 100 small confetti pieces
    for (let i = 0; i < 100; i++) {
        // make a new <div> element for each confetti
        let c = document.createElement("div");
        c.className = "confetti"; // add CSS class for style

        // place it randomly across screen width (0 to 100vw)
        c.style.left = Math.random() * 100 + "vw";

        // add random delay before falling
        c.style.animationDelay = Math.random() * 3 + "s";

        // give it a random bright color
        c.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;

        // add confetti piece to the page
        document.body.appendChild(c);

        // remove it after 4 seconds (cleanup)
        setTimeout(() => c.remove(), 4000);
    }
}


function playAgain() {
    // Go back to the first page (welcome page)
    showPage("welcomePage");

    // Reset the username input box
    document.getElementById("username").value = "";

    // Set default display name
    document.getElementById("displayName").textContent = "User";

    // Set default avatar emoji
    document.getElementById("userAvatar").textContent = "👩‍💻";

    // Remove selected class from all avatars (manually)
    let avatars = document.getElementsByClassName("avatar");
    for (let i = 0; i < avatars.length; i++) {
        avatars[i].classList.remove("selected");
    }

    // Remove selected class from all difficulty buttons
    let diffButtons = document.getElementsByClassName("difficulty-option");
    for (let i = 0; i < diffButtons.length; i++) {
        diffButtons[i].classList.remove("selected");
    }

    // Set the default difficulty to "easy"
    let easyButton = document.querySelector(".difficulty-option[data-difficulty='easy']");
    easyButton.classList.add("selected");

    // Update difficulty variable
    difficulty = "easy";
}



// Initialize total questions display
document.getElementById("totalQuestions").textContent = totalQuestions;

function updateProgress() {
    // Calculate how much of the quiz is completed
    let progressPercent = ((currentQuestion + 1) / totalQuestions) * 100;

    // Get the progress bar element
    let progressBar = document.getElementById("progress");

    // Change the bar size (width) according to progress
    progressBar.style.width = progressPercent + "%";

    // Show percentage text inside the bar
    progressBar.textContent = Math.round(progressPercent) + "%";

    // Show current question number on the screen
    document.getElementById("currentQuestionNum").textContent = currentQuestion + 1;
}


// Next question button click
// When user clicks the "Next" button
let nextButton = document.getElementById("nextBtn");

// Add a click event listener
nextButton.addEventListener("click", function() {
    // Move to the next question
    nextQuestion();

    // Update the progress bar
    updateProgress();
});



// Initialize progress bar
updateProgress();