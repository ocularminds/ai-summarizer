const Website = require('./website');
const axios = require('axios');

const MODELS = {'MODEL_GPT': 'gpt-4o-mini', 'MODEL_LLAMA': 'llama3.2'};

class Summarizer {

    constructor(url){
        this.systemPrompt = `You are an assistant that analyzes the contents of a website \
        and provides a short summary, ignoring text that might be navigation related. \
        Respond in markdown.`;
        this.website = new Website(url);
    }

    async createUserPrompt() {
        console.log('creating user prompt...');
        await this.website.scrape();
        let prompt = `You are looking at a website titled ${this.website.title}. `;
        prompt += `The contents of this website are as follows; please provide a short summary of this website in markdown. `;
        prompt += `If it includes news or announcements, then summarize these too.\n\n`;
        prompt += this.website.text;
        return prompt;
    }

    async build() {
        const userPrompt = await this.createUserPrompt();
        return [
            {"role": "system", "content": this.systemPrompt},
            {"role": "user", "content": userPrompt}
        ];
    }

    async summarizeWithOpenAI(messages) {
        const endpoint = 'https://api.openai.com/v1/chat/completions';
        const model = MODELS.MODEL_GPT;
        const headers = {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
        };
        try {
            const response = await axios.post(endpoint, { model, messages }, { headers });
            return response.data.choices[0].message.content;
        } catch (error) {
            console.error('Error with OpenAI API:', error.message);
            throw new Error('Failed to fetch response from OpenAI');
        }
    }

    async summarizeWithLama(messages){
        const stream = false;
        const endpoint = "http://localhost:11434/api/chat";
        try {
            const response = await axios.post(endpoint, { model, messages,stream }, { headers });
            return response.data.choices[0].message.content;
        } catch (error) {
            console.error('Error with OpenAI API:', error.message);
            throw new Error('Failed to fetch response from OpenAI');
        }
    }

    async summarize() {
        const messages = await this.build();
        return await this.summarizeWithOpenAI(messages);
    }
}

module.exports = Summarizer;
