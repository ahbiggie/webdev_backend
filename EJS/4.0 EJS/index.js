import express from 'express';

const app = express();
const port = 3000;

// Set the view engine to EJS
app.set('view engine', 'ejs');

//Routes
app.get('/', (req, res) => {
    const day = new Date().getDay(); // 0 (sunday) to 6 (saturday)
    let dayType = "a weekday";
    let advice = "it's a good day to study hard!";
    if (day === 0 || day === 6) {
        dayType = "the weekend";
        advice = "it's a good day to relax!";
    }

    res.render('index', {
        dayType: dayType,
        advice: advice
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});