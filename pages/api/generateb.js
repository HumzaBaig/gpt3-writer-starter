import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
});

const openai = new OpenAIApi(configuration);

const basePromptPrefix =
`
Write a short inspirational and conversational paragraph about a topic in the style of Imam Omar Suleiman. Include a reference to a Sahih (authentic) Hadith of the Prophet Muhammad ﷺ or a quote from a famous Muslim scholar about this topic. If a Hadith is referenced, make sure to include exactly where it was found. Make sure not to reference any Wahhabi scholars. This paragraph should also contain a call-to-action. Please make sure the paragraph goes in-depth on the topic and shows that the writer did their research. Use emojis as well.
Topic:
`;

const generateAction = async (req, res) => {
    // Run first prompt
    console.log(`API: ${basePromptPrefix}${req.body.userInput}`);

    const baseCompletion = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: `${basePromptPrefix}${req.body.userInput}\n`,
        temperature: 0.8,
        max_tokens: 750
    });

    const basePromptOutput = baseCompletion.data.choices.pop();

    res.status(200).json({ output: basePromptOutput });
};

export default generateAction;