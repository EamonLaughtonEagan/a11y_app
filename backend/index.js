import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { OpenAI } from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT;
const API_KEY = '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';
const ORG = process.env.ORG;

const openai = new OpenAI({
    organization: ORG,
    apiKey: API_KEY
})

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/chat', async (req, res) => {
    res.status(200).json({
        success: true,
        data: req.body
    })
})

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
            content: 'you are an accessibilty expert trained in wcag 2.1 and deque axe tool specifically for finding violations in websites'
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