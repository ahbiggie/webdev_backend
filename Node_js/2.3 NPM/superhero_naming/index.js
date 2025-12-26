import superheroes from 'superheroes';
/*superheroes is an Array:

The superheroes package exports an array of superhero names.

Example: ['Spider-Man', 'Batman', 'Wonder Woman', ...].

Random Selection:

Use Math.random() to generate a random index.

Use Math.floor() to round down to the nearest integer.

Access the array at the random index to get a superhero name.*/
const randomName = superheroes[Math.floor(Math.random() * superheroes.length)];
console.log(`My superhero name is ${randomName}`);