import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { OpenAI } from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT;
const API_KEY = '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';
const ORG = process.env.ORG;

const initialPrompt = {
    role: 'system',
    content: 'you are an accessibilty expert trained in wcag 2.2 and deque axe tool specifically for finding violations in websites'
}

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
    let messages = [initialPrompt]
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
    let messages = [initialPrompt]

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
        messages: messages,
    })
    
    res.json({
        message: response?.choices?.[0]?.message?.content
    })
})

app.post('/chat/:index', async (req, res) => {
    
    //TODO: Implement this route
    console.log('from /chat:/index', req.body);
    const chat = req.body.chat;
    let messages = [initialPrompt];

    // Iterate over chatLog and create a new object for each message
    chat.forEach(log => {
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
        messages: messages,
    })

    const message = response.choices[0].message.content;
    console.log('response from /chat:/index: ', message);
    res.json({
        message: message,
    })
})

app.post('/help', async (req, res) => {
    const descriptions = req.body.descriptions;
    console.log('/help - ', descriptions);
    const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        response_format: {'type': 'json_object'},
        messages: [
            initialPrompt,
            {
                role: 'assistant',
                content: descriptions,
            },
            {
                role: 'user',
                content: 'provide solutions for the accessibility violations in JSON format {"violations": [{"violation": "string", "solution": "string"}]}'
            }
        ]
    });

    console.log('response: ', response.choices[0].message.content);
    const message = response.choices[0].message.content;
    res.json({
        message: message,
    })

})

app.post('/solutions/:index', async (req, res) => {
    const index = req.params.index;
    const description = req.body.description;

    const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        response_format: {'type': 'json_object'},
        messages: [
            initialPrompt,
            {
                role: 'assistant',
                content: description,
            },
            {
                role: 'user',
                content: 'provide solutions for this specific accessibility violation in JSON format {"violation": [{"solution": "string", example: "string"}]} and let the example only be html'
            }
        ]
    });

    console.log('response: ', response.choices[0].message.content);
    const message = response.choices[0].message.content;
    res.json({
        message: message,
        index: index
    })
})


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 