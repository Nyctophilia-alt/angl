// Функция для перемешивания массива
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Функция для создания вопроса с перемешанными вариантами
function createQuestion(question, options, correctAnswer) {
    const shuffledOptions = shuffleArray([...options]);
    const newCorrectIndex = shuffledOptions.indexOf(options[correctAnswer]);
    return {
        question: question,
        options: shuffledOptions,
        correct: newCorrectIndex
    };
}

const grammarQuestions = [
    createQuestion(
        "Choose the correct form: 'She ___ to school every day.'",
        ["go", "goes", "going", "gone"],
        1
    ),
    createQuestion(
        "Which sentence is correct?",
        [
            "I am living here since 2010",
            "I have been living here since 2010",
            "I live here since 2010",
            "I was living here since 2010"
        ],
        1
    ),
    createQuestion(
        "Select the correct conditional form: 'If I ___ rich, I would buy a house.'",
        ["am", "were", "was", "will be"],
        1
    ),
    createQuestion(
        "Choose the correct article: '___ university is a place of learning.'",
        ["A", "An", "The", "No article needed"],
        1
    ),
    createQuestion(
        "Which sentence contains an error?",
        [
            "Neither of them is going",
            "Either John or Mary are going",
            "Both of them are going",
            "None of them is going"
        ],
        1
    )
];

const vocabularyQuestions = [
    createQuestion(
        "Which word is a synonym for 'happy'?",
        ["Sad", "Joyful", "Angry", "Tired"],
        1
    ),
    createQuestion(
        "What is the opposite of 'generous'?",
        ["Kind", "Stingy", "Wealthy", "Giving"],
        1
    ),
    createQuestion(
        "Choose the correct spelling:",
        ["Accomodation", "Accommodation", "Accomodation", "Acomodation"],
        1
    ),
    createQuestion(
        "Which word is a countable noun?",
        ["Water", "Rice", "Book", "Sugar"],
        2
    ),
    createQuestion(
        "Choose the correct phrasal verb: 'Can you ___ the children while I'm away?'",
        ["look at", "look for", "look after", "look up"],
        2
    )
];

const listeningQuestions = [
    createQuestion(
        "Listen to the audio and choose what the speaker likes to do:",
        ["Reading books", "Playing sports", "Watching movies", "Cooking"],
        2
    ),
    createQuestion(
        "What is the weather like according to the forecast?",
        ["Sunny and warm", "Rainy and cold", "Cloudy with some rain", "Clear and cool"],
        2
    ),
    createQuestion(
        "Where is the meeting taking place?",
        ["Conference room", "Coffee shop", "Office", "Restaurant"],
        0
    ),
    createQuestion(
        "What time does the train leave?",
        ["9:15 AM", "9:50 AM", "10:15 AM", "10:50 AM"],
        2
    ),
    createQuestion(
        "What did the person order?",
        ["Coffee and cake", "Tea and cookies", "Coffee and sandwich", "Tea and sandwich"],
        0
    )
];

// Функция для перемешивания вопросов в тесте
function shuffleQuestions(questions) {
    return shuffleArray([...questions]);
}

let currentTest = 'grammar';
let questions = shuffleQuestions(grammarQuestions);
let currentQuestion = 0;
let score = 0;
let isAnswered = false;

const testDescriptions = {
    grammar: "Test your knowledge of English grammar, including verb forms, articles, and sentence structure.",
    vocabulary: "Check your understanding of English words, synonyms, antonyms, and phrasal verbs.",
    listening: "Practice your listening skills with various audio examples and conversations.",
    mixed: "A combination of grammar, vocabulary, and listening exercises for comprehensive practice."
};

const testInfo = {
    grammar: { questions: 5, time: "10 min" },
    vocabulary: { questions: 5, time: "8 min" },
    listening: { questions: 5, time: "15 min" },
    mixed: { questions: 5, time: "12 min" }
};

// Get DOM elements
const welcomeScreen = document.getElementById('welcome-screen');
const questionScreen = document.getElementById('question-screen');
const resultsScreen = document.getElementById('results-screen');
const questionElement = document.getElementById('question');
const optionsElement = document.getElementById('options');
const progressElement = document.getElementById('progress');
const scoreElement = document.getElementById('score');
const feedbackElement = document.getElementById('feedback');
const testDescription = document.getElementById('test-description');
const questionCount = document.getElementById('question-count');
const estimatedTime = document.getElementById('estimated-time');

// Add event listeners
document.getElementById('start-btn').addEventListener('click', startQuiz);
document.getElementById('next-btn').addEventListener('click', nextQuestion);
document.getElementById('restart-btn').addEventListener('click', restartQuiz);
document.getElementById('choose-test-btn').addEventListener('click', showWelcomeScreen);

// Add tab button listeners
document.querySelectorAll('.tab-btn').forEach(button => {
    button.addEventListener('click', () => {
        // Update active tab
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Update current test
        currentTest = button.dataset.test;
        
        // Update questions based on test type and shuffle them
        switch(currentTest) {
            case 'grammar':
                questions = shuffleQuestions(grammarQuestions);
                break;
            case 'vocabulary':
                questions = shuffleQuestions(vocabularyQuestions);
                break;
            case 'listening':
                questions = shuffleQuestions(listeningQuestions);
                break;
            case 'mixed':
                questions = shuffleQuestions([
                    ...grammarQuestions.slice(0, 2),
                    ...vocabularyQuestions.slice(0, 2),
                    ...listeningQuestions.slice(0, 1)
                ]);
                break;
        }
        
        // Update test information
        updateTestInfo();
    });
});

function updateTestInfo() {
    testDescription.textContent = testDescriptions[currentTest];
    questionCount.textContent = testInfo[currentTest].questions;
    estimatedTime.textContent = testInfo[currentTest].time;
}

function showWelcomeScreen() {
    resultsScreen.classList.remove('active');
    resultsScreen.classList.add('hidden');
    welcomeScreen.classList.remove('hidden');
    welcomeScreen.classList.add('active');
    currentQuestion = 0;
    score = 0;
    updateTestInfo();
}

function startQuiz() {
    welcomeScreen.classList.remove('active');
    welcomeScreen.classList.add('hidden');
    questionScreen.classList.remove('hidden');
    questionScreen.classList.add('active');
    // Перемешиваем вопросы при старте теста
    questions = shuffleQuestions(questions);
    showQuestion();
}

function showQuestion() {
    isAnswered = false;
    const question = questions[currentQuestion];
    questionElement.textContent = question.question;
    
    // Update progress bar
    const progress = ((currentQuestion) / questions.length) * 100;
    progressElement.style.width = `${progress}%`;
    
    // Clear previous options
    optionsElement.innerHTML = '';
    
    // Create new option buttons
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option';
        button.textContent = option;
        button.addEventListener('click', () => selectOption(index));
        optionsElement.appendChild(button);
    });
    
    document.getElementById('next-btn').style.display = 'none';
}

function selectOption(index) {
    if (isAnswered) return;
    
    isAnswered = true;
    const options = optionsElement.children;
    const correct = questions[currentQuestion].correct;
    
    // Show correct/wrong answers
    for (let i = 0; i < options.length; i++) {
        options[i].classList.add(i === correct ? 'correct' : 'wrong');
    }
    
    if (index === correct) score++;
    
    document.getElementById('next-btn').style.display = 'block';
}

function nextQuestion() {
    currentQuestion++;
    
    if (currentQuestion < questions.length) {
        showQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    questionScreen.classList.remove('active');
    questionScreen.classList.add('hidden');
    resultsScreen.classList.remove('hidden');
    resultsScreen.classList.add('active');
    
    scoreElement.textContent = score;
    const percentage = (score / questions.length) * 100;
    
    let feedback;
    if (percentage === 100) {
        feedback = "Perfect! You have excellent English skills!";
    } else if (percentage >= 80) {
        feedback = "Great job! You have a very good understanding of English!";
    } else if (percentage >= 60) {
        feedback = "Good effort! Keep practicing to improve your English!";
    } else {
        feedback = "Keep studying! With more practice, you'll improve your English skills!";
    }
    
    feedbackElement.textContent = feedback;
}

function restartQuiz() {
    currentQuestion = 0;
    score = 0;
    // Перемешиваем вопросы при перезапуске теста
    questions = shuffleQuestions(questions);
    resultsScreen.classList.remove('active');
    resultsScreen.classList.add('hidden');
    questionScreen.classList.remove('hidden');
    questionScreen.classList.add('active');
    showQuestion();
}

// Initialize test information
updateTestInfo(); 