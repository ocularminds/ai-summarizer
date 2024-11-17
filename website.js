const axios = require('axios');
const cheerio = require('cheerio');

class Website {
    /**
     * A utility class to represent a Website that we have scraped
     */
    constructor(url) {
        this.url = url;
        this.title = '';
        this.text = '';
    }

    async scrape() {
        try {
            console.log('scraping from ' + this.url);
            const response = await axios.get(this.url);
            const $ = cheerio.load(response.data);

            this.title = $('title').text() || 'No title found';
            
            $('body').find('script, style, img, input').remove();
            this.text = $('body').text().replace(/\s+/g, '\n').trim();
        } catch (error) {
            console.error(`Error fetching the URL: ${error}`);
        }
    }
}
module.exports = Website;