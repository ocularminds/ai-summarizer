
require('dotenv').config();
const Summarizer = require('./summarizer');

const testUrl = 'https://www.oracle.com/';
console.log('Start Summarizing: ' + testUrl);
new Summarizer(testUrl).summarize().then((error, result) => console.log(error, result));
