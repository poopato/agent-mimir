
const ChatOpenAI = require('langchain/chat_models/openai').ChatOpenAI;
const WebBrowser = require('langchain/tools/webbrowser').WebBrowser;
const OpenAIEmbeddings = require('langchain/embeddings/openai').OpenAIEmbeddings;

const taskModel = new ChatOpenAI({
    openAIApiKey: process.env.AGENT_OPENAI_API_KEY,
    temperature: 0.9,
});
const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.AGENT_OPENAI_API_KEY,
});
const chatModel = new ChatOpenAI({
    openAIApiKey: process.env.AGENT_OPENAI_API_KEY,
    temperature: 0.9,
    modelName: 'gpt-4'
});


module.exports = async function() {
    return {
        continuousMode: false,
        agents: {
            'Assistant': { 
                mainAgent: true, 
                description: 'An assistant', 
                definition: {
                    chatModel: chatModel,
                    taskModel: taskModel,
                    summaryModel: taskModel,
                    profession: 'an Assistant',
                    tools: [ 
                        new WebBrowser({
                            model: taskModel,
                            embeddings: embeddings,
                        })
                    ]
                }
            }
        }
    }
}