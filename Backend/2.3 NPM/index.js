//var generateName = require("sillyname");

import generateName from "sillyname";
import superheroes, { randomSuperhero } from "superheroes";

var sillyName = generateName();

console.log(`My name is ${sillyName}`);

console.log(randomSuperhero());

console.log(superheroes);