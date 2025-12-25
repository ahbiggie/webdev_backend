import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

//Step 1: Run the solution.js file without looking at the code.
//Step 2: You can go to the recipe.json file to see the full structure of the recipeJSON below.
const recipeJSON =
  [
    {
      "id": "0001",
      "type": "taco",
      "name": "Chicken Taco",
      "price": 2.99,
      "ingredients": {
        "protein": {
          "name": "Chicken",
          "preparation": "Grilled"
        },
        "salsa": {
          "name": "Tomato Salsa",
          "spiciness": "Medium"
        },
        "toppings": [
          {
            "name": "Lettuce",
            "quantity": "1 cup",
            "ingredients": [
              "Iceberg Lettuce"
            ]
          },
          {
            "name": "Cheese",
            "quantity": "1/2 cup",
            "ingredients": [
              "Cheddar Cheese",
              "Monterey Jack Cheese"
            ]
          },
          {
            "name": "Guacamole",
            "quantity": "2 tablespoons",
            "ingredients": [
              "Avocado",
              "Lime Juice",
              "Salt",
              "Onion",
              "Cilantro"
            ]
          },
          {
            "name": "Sour Cream",
            "quantity": "2 tablespoons",
            "ingredients": [
              "Sour Cream"
            ]
          }
        ]
      }
    },
    {
      "id": "0002",
      "type": "taco",
      "name": "Beef Taco",
      "price": 3.49,
      "ingredients": {
        "protein": {
          "name": "Beef",
          "preparation": "Seasoned and Grilled"
        },
        "salsa": {
          "name": "Salsa Verde",
          "spiciness": "Hot"
        },
        "toppings": [
          {
            "name": "Onions",
            "quantity": "1/4 cup",
            "ingredients": [
              "White Onion",
              "Red Onion"
            ]
          },
          {
            "name": "Cilantro",
            "quantity": "2 tablespoons",
            "ingredients": [
              "Fresh Cilantro"
            ]
          },
          {
            "name": "Queso Fresco",
            "quantity": "1/4 cup",
            "ingredients": [
              "Queso Fresco"
            ]
          }
        ]
      }
    },
    {
      "id": "0003",
      "type": "taco",
      "name": "Fish Taco",
      "price": 4.99,
      "ingredients": {
        "protein": {
          "name": "Fish",
          "preparation": "Battered and Fried"
        },
        "salsa": {
          "name": "Chipotle Mayo",
          "spiciness": "Mild"
        },
        "toppings": [
          {
            "name": "Cabbage Slaw",
            "quantity": "1 cup",
            "ingredients": [
              "Shredded Cabbage",
              "Carrot",
              "Mayonnaise",
              "Lime Juice",
              "Salt"
            ]
          },
          {
            "name": "Pico de Gallo",
            "quantity": "1/2 cup",
            "ingredients": [
              "Tomato",
              "Onion",
              "Cilantro",
              "Lime Juice",
              "Salt"
            ]
          },
          {
            "name": "Lime Crema",
            "quantity": "2 tablespoons",
            "ingredients": [
              "Sour Cream",
              "Lime Juice",
              "Salt"
            ]
          }
        ]
      }
    }
  ];

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * GET route handler for the home page
 * Renders the initial index.ejs template without any recipe data
 */
app.get("/", (req, res) => {
  res.render("index.ejs");
});

/**
 * POST route handler for recipe selection
 * Receives form data from button click and finds matching recipe
 * @param {Object} req.body.choice - The protein type selected (chicken, beef, or fish)
 * @returns Renders index.ejs with the matched recipe object
 */
app.post("/recipe", (req, res) => {
  // Step 1: Extract the protein choice from the form submission
  // The "choice" field comes from the name="choice" attribute in the form buttons
  const recipeType = req.body.choice;

  // Step 2: Search through recipeJSON array to find matching recipe
  // Uses .find() to iterate through each recipe (r) in the array
  // Compares the nested protein name with the user's choice (case-insensitive)
  const recipe = recipeJSON.find(r =>
    r.ingredients.protein.name.toLowerCase() === recipeType.toLowerCase()
  );

  // Step 3: Render the index.ejs template and pass the found recipe object
  // The recipe object will be available in the EJS template as "recipe"
  // If no match is found, recipe will be undefined (handled by the template)
  res.render("index.ejs", { recipe: recipe });
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
