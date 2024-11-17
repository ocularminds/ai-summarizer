const Summarizer = require('./sumarizer');

//(async () => {
    const testUrl = 'https://www.oracle.com';
    new Summarizer(testUrl).summarize().then(result => console.log(result));
//})();
