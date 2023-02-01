const generateAction = async (req, res) => {
    // Run first prompt

    const baseCompletion = await fetch('https://api.openai.com/v1/engines/text-davinci-003/jobs', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            prompt: `${basePromptPrefix}${req.body.userInput}\n`,
            temperature: 0.8,
            max_tokens: 256
        }),
        timeout: 15000
    })
    .then(response => response.json())
    .then(data => {
        const basePromptOutput = data.choices.pop();
        // Create and run second prompt
        const secondPrompt =
        `
        Write a short inspirational and conversational paragraph about the topic and quote below in the style of Imam Omar Suleiman. Make sure not to reference any Wahhabi scholars. This paragraph should also contain a call-to-action. Please make sure the paragraph goes in-depth on the topic and shows that the writer did their research. Use modern emojis to grab the attention of the reader. Also, make sure this paragraph is written by OYD and directly addresses the reader.

        Topic: ${req.body.userInput}

        Quote: ${basePromptOutput.text}

        Paragraph:
        `;

        return fetch('https://api.openai.com/v1/engines/text-davinci-003/jobs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                prompt: `${secondPrompt}`,
                temperature: 0.9,
                max_tokens: 850
            }),
            timeout: 15000
        })
        .then(response => response.json());
    })
    .then(data => {
        const secondPromptOutput = data.choices.pop();
        res.status(200).json({ output: secondPromptOutput });
    })
    .catch(error => {
        console.error(error);
        res.status(500).json({ error });
    });
};

export default generateAction;
