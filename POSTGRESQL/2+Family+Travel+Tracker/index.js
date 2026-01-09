/**
 * Family Travel Tracker Application
 * Tracks countries visited by different family members
 * Uses PostgreSQL database to store user and country data
 */

import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

// Initialize Express application
const app = express();
const port = 3000;

/**
 * PostgreSQL database client configuration
 * Connects to 'world' database containing countries and visited_countries tables
 */
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "123456",
  port: 5432,
});
// Establish database connection
db.connect();

// Middleware: Parse URL-encoded request bodies (form data)
app.use(bodyParser.urlencoded({ extended: true }));
// Middleware: Serve static files from 'public' directory
app.use(express.static("public"));

/**
 * Tracks the currently selected user ID
 * Used to filter visited countries by user
 */
let currentUserId = 1;

/**
 * Retrieves all visited country codes from the database
 * @async
 * @returns {Promise<Array<string>>} Array of country codes (e.g., ["US", "FR", "JP"])
 */
async function checkVisisted() {
  // We JOIN the tables to link the visited countries to the users
  const result = await db.query("SELECT country_code FROM visited_countries JOIN users ON visited_countries.user_id = users.id WHERE users.id = $1;", [currentUserId]);

  // initialize empty array to hold country codes
  let countries = [];
  // Extract country codes from query result rows
  result.rows.forEach((country) => {
    countries.push(country.country_code);
  });

  return countries;
}
/**
 * GET / - Home page route
 * Displays the travel tracker with all visited countries
 * @route GET /
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
app.get("/", async (req, res) => {
  // Fetch all family members from the database (if needed)
  const userResult = await db.query("SELECT * FROM users;");
  // Extract users from query result
  const users = userResult.rows;

  // 2. Fetch the specific countries for the CURRENT user
  const countries = await checkVisisted();


  // Debug: Log country codes to verify data
  console.log("Countries for user", currentUserId, ":", countries);

  // 3. Find the current user's color preference
  const currentUser = users.find((user) => user.id === currentUserId);

  // Render the main page with country data and user information
  res.render("index.ejs", {
    countries: countries,           // Array of visited country codes
    total: countries.length,        // Total count of visited countries
    users: users,                   // Array of family members
    color: currentUser ? currentUser.color : "teal",                  // Default color (should use currentUserId)
  });
});
/**
 * POST /add - Add a new visited country
 * Searches for country by name and adds it to visited countries
 * @route POST /add
 * @param {Object} req - Express request object
 * @param {Object} req.body.country - Country name entered by user
 * @param {Object} res - Express response object
 */
app.post("/add", async (req, res) => {
  // Get country name from form input
  const input = req.body["country"];

  try {
    // Search for country in database using partial, case-insensitive match
    // Uses LIKE with wildcards to match partial country names
    const result = await db.query(
      "SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%';",
      [input.toLowerCase()]
    );

    // Check if country was found
    if (result.rows.length === 0) {
      console.log("Country not found");
      return res.redirect("/");
    }

    // Extract country code from first matching result
    const data = result.rows[0];
    const countryCode = data.country_code;

    try {
      // Insert the visited_countries with the current user ID
      await db.query(
        "INSERT INTO visited_countries (country_code, user_id) VALUES ($1, $2)",
        [countryCode, currentUserId]
      );
      // Redirect to home page to show updated list
      res.redirect("/");
    } catch (err) {
      // Handle duplicate entry errors (country already visited)
      console.log(err);
      res.redirect("/");
    }
  } catch (err) {
    // Handle country not found errors
    console.log(err);
    res.redirect("/");
  }
});
/**
 * POST /user - Switch to a different family member
 * Updates the current user and displays their visited countries
 * @route POST /user
 * @param {Object} req - Express request object
 * @param {Object} req.body.user - Selected user ID from form
 * @param {Object} res - Express response object
 * @todo Implement user switching functionality
 */
app.post("/user", async (req, res) => {
  // Check if user clicked "Add New Family Member" button
  if (req.body.add) {
    // Render new user form
    res.render("new.ejs");
  } else {
    //Update currentUserId based on req.body.user Parse to integer and redirect to home page
    currentUserId = parseInt(req.body.user);
    res.redirect("/");
  }
});


/**
 * POST /new - Add a new family member
 * Creates a new user with their name and color preference
 * @route POST /new
 * @param {Object} req - Express request object
 * @param {Object} req.body.name - New user's name
 * @param {Object} req.body.color - New user's color preference
 * @param {Object} res - Express response object
 * @todo Implement new user creation
 * @see {@link https://www.postgresql.org/docs/current/dml-returning.html|PostgreSQL RETURNING clause}
 */
app.post("/new", async (req, res) => {
  const name = req.body.name;
  const color = req.body.color;
  // The RETURNING keyword can return the data that was inserted.
  const result = await db.query(
    "INSERT INTO users (name, color) VALUES ($1, $2) RETURNING *;",
    [name, color]
  );
  // catch the returned user data
  const newUser = result.rows[0];
  // Auto switch to the newly created user
  currentUserId = newUser.id;
  res.redirect("/");


});

/**
 * Start the Express server
 * Listens for incoming HTTP requests on the specified port
 */
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
