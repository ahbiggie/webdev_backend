/**
 * World Capital Quiz Application
 * A web-based quiz game that tests users' knowledge of world capitals
 * @module WorldCapitalQuiz
 */

import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

/** Express application instance */
const app = express();

/** Port number for the server */
const port = 3000;

/** Define a PostGreSQL client (configuration) */
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "Password",
  port: 5432,
});
db.connect();


// Load quiz data from the database
db.query("SELECT * FROM capitals", (err, res) => {
  if (err) {
    console.error("Error executing query", err.stack);
  } else {
    quiz = res.rows;
  }
  db.end();
})
/**
 * Quiz data containing country-capital pairs
 * @type {Array<{country: string, capital: string}>}
 */
let quiz = [
  { country: "France", capital: "Paris" },
  { country: "United Kingdom", capital: "London" },
  { country: "United States of America", capital: "New York" },
];

/** Counter to track the total number of correct answers in the current session */
let totalCorrect = 0;

// Middleware configuration
// Parse URL-encoded form data from POST requests
app.use(bodyParser.urlencoded({ extended: true }));
// Serve static files (CSS, images, etc.) from the 'public' directory
app.use(express.static("public"));

/** Stores the current quiz question being displayed to the user */
let currentQuestion = {};

/**
 * GET route for the home page
 * Initializes a new quiz session by resetting the score and loading the first question
 * @route GET /
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
app.get("/", async (req, res) => {
  // Reset the score to 0 when starting a new quiz session
  totalCorrect = 0;
  // Select a random question from the quiz array
  await nextQuestion();
  console.log(currentQuestion);
  // Render the quiz page with the first question
  res.render("index.ejs", { question: currentQuestion });
});

/**
 * POST route for submitting quiz answers
 * Validates the user's answer, updates the score, and loads the next question
 * @route POST /submit
 * @param {Object} req - Express request object containing the user's answer
 * @param {Object} res - Express response object
 */
app.post("/submit", (req, res) => {
  // Get the user's answer from the form and remove whitespace
  let answer = req.body.answer.trim();

  // Flag to track if the answer is correct
  let isCorrect = false;

  // Compare the answer with the correct capital (case-insensitive)
  if (currentQuestion.capital.toLowerCase() === answer.toLowerCase()) {
    // Increment score for correct answer
    totalCorrect++;
    console.log(totalCorrect);
    isCorrect = true;
  }

  // Load the next random question
  nextQuestion();

  // Render the page with the new question and feedback about the previous answer
  res.render("index.ejs", {
    question: currentQuestion,
    wasCorrect: isCorrect,
    totalScore: totalCorrect,
  });
});

/**
 * Selects a random question from the quiz array
 * Updates the currentQuestion variable with a randomly selected country-capital pair
 * @async
 * @function nextQuestion
 * @returns {Promise<void>}
 */
async function nextQuestion() {
  // Generate a random index within the quiz array bounds
  const randomCountry = quiz[Math.floor(Math.random() * quiz.length)];

  // Update the current question with the randomly selected country-capital pair
  currentQuestion = randomCountry;
}

/**
 * Start the Express server
 * Listens for incoming HTTP requests on the specified port
 */
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
