
const Website = require('./website');
class Summarizer {

    systemPrompt = `You are an assistant that analyzes the contents of a website \
    and provides a short summary, ignoring text that might be navigation related. \
    Respond in markdown.`;

    constructor(url){
        this.website = new Website(url);
    }

    async createUserPrompt() {  
        await this.website.scrape();      
        const prompt = `"You are looking at a website titled ${website.title}`;
        prompt += `The contents of this website is as follows;
                    please provide a short summary of this website in markdown.
                    If it includes news or announcements, then summarize these too.\n\n`;
        prompt += website.text
        return prompt;
    }

    build() {        
        return [
            {"role": "system", "content": systemPrompt},
            {"role": "user", "content": createUserPrompt(website)}
        ]
    }

    summarizeWithOpenAI = async (messages) => {
        const endpoint = 'https://api.openai.com/v1/chat/completions';
        const model = "gpt-3.5-turbo";
        const headers = {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
        };
        try {
            const response = await axios.post(endpoint, { model, messages}, {headers});
            return response.data.choices[0].message.content;            
        } catch (error) {
            console.error('Error with OpenAI API:', error.message);
            res.status(500).json({ error: 'Failed to fetch response from OpenAI', details: error.message });
        }
    }

    summarize = async () => {        
        const messages = build(website);
        return await summarizeWithOpenAI(messages);
    }
}
module.exports = Summarizer;