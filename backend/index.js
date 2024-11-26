import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { OpenAI } from 'openai';

// place in .env file
const PORT = 5000;
const API_KEY = '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'

const openai = new OpenAI({
    organization: "org-h1pJKKZZEwlKIHLQRucwfc4b",
    apiKey: API_KEY
})

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/violations', async (req, res) => {
    console.log(req.body);
    const chatLog = req.body.chatLog;
    let messages = [
        {
            role: 'system',
            content: 'you are an accessibilty expert trained in wcag 2.1 and deque axe tool specifically for finding violations in websites'
        },
    ]
    chatLog.forEach(log => {
        if (log.message) {
            if (log.agent === 'user') {
                messages.push({
                    role: 'user',
                    content: log.message
                })
            } else {
                messages.push({
                    role: 'assistant',
                    content: log.message
                })
            }
        }
    })

    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: messages
    })
    
    res.json({
        message: response?.choices?.[0]?.message?.content
    })

    console.log("OpenAI response: ", response.choices[0].message.content);
})

app.post('/chat', async (req, res) => {
    console.log(req.body)
    const chatLog = req.body.chatLog;
    let messages = [
        {
            role: 'system',
            content: 'you are an accessibilty expert trained in wcag 2.0 and deque axe tool specifically for finding violations in websites'
        }
    ]

    // Iterate over chatLog and create a new object for each message
    chatLog.forEach(log => {
        if (log.message) {
            if (log.agent === 'user') {
                messages.push({
                    role: 'user',
                    content: log.message
                })
            } else {
                messages.push({
                    role: 'assistant',
                    content: log.message
                })
            }
        }
    })

    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: messages
    })
    
    res.json({
        message: response?.choices?.[0]?.message?.content
    })
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});