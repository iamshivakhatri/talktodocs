import {OpenAIApi, Configuration} from 'openai-edge'; 

const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
});

const openai = new OpenAIApi(config);

export async function getEmbeddings(text: string){

    try{
        if (typeof text !== 'string') {
            throw new TypeError('Input text must be a string.');
        }

        console.log("Received text:", text);
        const response = await openai.createEmbedding({
            model: 'text-embedding-ada-002',
            input: text.replace(/\n/g, ' ')
        });
        const result = await response.json();
        console.log("Result from OpenAI", result);
        return result.data[0].embedding;

    }catch(error){
        console.error(error);
    }
}

// [ -0.010930763, 0.0004580362, 0.022358378, -0.01414723, -0.032687686 ]