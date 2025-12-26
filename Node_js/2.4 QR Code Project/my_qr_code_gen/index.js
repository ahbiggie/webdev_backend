/**
 * This script prompts the user to enter a URL and generates a QR code image for the provided URL.
 * It uses the 'inquirer' module for user input, 'qr-image' module for generating QR code images,
 * and 'fs' module for file system operations.
 */

import inquirer from "inquirer";
import qr from "qr-image";
import fs from "fs";

/**
 * Prompts the user to enter a URL and generates a QR code image in SVG format.
 * The generated QR code image is saved as 'qr_img.svg' in the current directory.
 * 
 * @returns {void}
 */
inquirer
    .prompt([
        {
                name: "URL",
                message: "Enter the URL to generate QR code",
        }
    ])
    .then((answers) => {
        /**
         * @typedef {Object} Answers
         * @property {string} URL - The URL entered by the user.
         */
        const URL = answers.URL;
        
        /**
         * Generates a QR code image from the provided URL and saves it as 'qr_img.svg'.
         * 
         * @param {string} URL - The URL to generate the QR code for.
         * @returns {void}
         */
        const qr_svg = qr.image(URL);
        qr_svg.pipe(fs.createWriteStream('qr_img.png'));
        
        fs.writeFile("URL.txt", URL, (err) => {
              if (err) throw err;
              console.log("The file has been saved!");
            });
    })
    .catch((error) => {
        if (error.isTtyError) {
            // Prompt couldn't be rendered in the current environment
        } else {
            // Something else went wrong
        }
    });
