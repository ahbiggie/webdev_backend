// Read the file message.txt and print its content to the console. Use the fs module to read the file.
/*const fs = require('fs');
fs.readFile('message.txt', 'utf8', (err, data) => {
    if (err) throw err;
    console.log(data);
    });*/

// write to a file
const fs = require ('fs');
fs.writeFile('message.txt', 'Hello from Yusuf!', (err) => {
    if (err) throw err;
    console.log('The file has been Saved!');
})