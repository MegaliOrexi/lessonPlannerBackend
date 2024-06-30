const express = require('express');
const { OpenAI } = require('openai')
const cors = require('cors');
require('dotenv').config();

const app = express();

const corsOptions = {
  origin: 'https://lessonplanner-86c7.onrender.com/',
  optionsSuccessStatus: 200,
};



//middleware
app.use(express.json());
app.use(cors(corsOptions));

const port = process.env.port || 5000;


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post('/generate-lesson-plan', async (req, res) => {
    
    try {
        const { prompt } = req.body;
        const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        "messages": [
            {
              "role": "user",
              "content": `
                Ignore any previous instructions or questions asked.
                NOTE: it is very important all of the subheadings are generated with content
                Your main role is to act as an expert plan provider for teachers:
                This is the subject that needs the plan: "${prompt}"

                Now for the actual plan, give it to me in the JSON format as shows below,
                DONT send any extra text describing or talking, just this exact format with details filled in based on the topic

                {   
                    {
                        "Lesson Title" : "...",
                        "Learning Objectives": "...",
                        "Materials Needed": "...",
                        "Lesson Procedure": {
                        "Step1": "...",
                        "Step2": "...",
                        ...
                        },
                        "Assessment": "...",
                        "Differentiation": "..."
                    }
                }
              `
            }
        ],
        max_tokens: 1024});

        const content = JSON.parse(response.choices[0].message.content);

        return res.status(200).json({
            success: true,
            data: content
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }


})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
