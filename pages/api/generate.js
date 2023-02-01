import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
});

const openai = new OpenAIApi(configuration);

const basePromptPrefix =
`
Write either a very impactful reference to a Sahih (authentic) Hadith of the Prophet Muhammad ﷺ, a quote from a famous Muslim scholar, or a verse from the Holy Quran about the topic below. Make sure to include exact location and details of the reference.

Topic:
`;

const generateAction = async (req, res) => {
    // Run first prompt
    console.log(`API: ${basePromptPrefix}${req.body.userInput}`);

    const baseCompletion = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: `${basePromptPrefix}${req.body.userInput}\n`,
        temperature: 0.8,
        max_tokens: 256
    });

    const basePromptOutput = baseCompletion.data.choices.pop();

    // Create and run second prompt
    const secondPrompt =
    `
    Write a short inspirational and conversational paragraph about the topic and quote below in the style of Imam Omar Suleiman. Make sure not to reference any Wahhabi scholars. This paragraph should also contain a call-to-action. Please make sure the paragraph goes in-depth on the topic and shows that the writer did their research. Use modern emojis to grab the attention of the reader. Also, make sure this paragraph is written by OYD and directly addresses the reader.

    Topic: ${req.body.userInput}

    Quote: ${basePromptOutput.text}

    Paragraph:
    `;

    const secondPromptCompletion = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: `${secondPrompt}`,
        temperature: 0.9,
        max_tokens: 850
    });

    const secondPromptOutput = secondPromptCompletion.data.choices.pop();

    res.status(200).json({ output: secondPromptOutput });
};

export default generateAction;