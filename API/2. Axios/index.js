import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Step 1: Make sure that when a user visits the home page,
//   it shows a random activity.You will need to check the format of the
//   JSON data from response.data and edit the index.ejs file accordingly.
app.get("/", async (req, res) => {
  try {
    const response = await axios.get("https://bored-api.appbrewery.com/random");
    const result = response.data;
    // console.log(result);
    res.render("index.ejs", { data: result });
  } catch (error) {
    console.error("Failed to make request:", error.message);
    res.render("index.ejs", {
      error: error.message,
    });
  }
});

app.post("/", async (req, res) => {
  // console.log(req.body);
  try {
    const response = await axios.get("https://bored-api.appbrewery.com/filter", {
      params: {
        type: req.body.type,
        participants: req.body.participants
      }
    });
    // API returns a new array of activities
    const activities = response.data;
    // console.log(`found ${activities.length} activities`);
    // Pick a random activity from the array
    const randomIndex = Math.floor(Math.random() * activities.length);
    const randomActivity = activities[randomIndex];
    // render the index.ejs template with the random activity
    res.render("index.ejs", { data: randomActivity });
  }
  catch (error) {
    // Handle error (including 404 - no activities found)
    console.log("Error:", error.message);
    // check if it's a 404 error (no matching activities)
    if (error.response && error.response.status === 404) {
      res.render("index.ejs", { error: "No activities found matching your criteria" });

    } else {
      res.render("index.ejs", { error: `failed to fetch activities: ${error.message}` });
    }
  }
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
