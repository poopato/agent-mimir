# <img src="assets/mimir_logo.svg" width="80" height="80"> Agent Mimir

Agent Mimir is a tooling, tasking, and memory system for AIs. It provides AIs the foundation to solve multi-step complex tasks using tools.

Mimir allows you to deploy configurable AI Agents to which you can give access to tools. Each agent has two different conversational memories, general chat memory and task memory.

Conversational memory is the main type memory where every messafe between you and the agent is recorded. When the agent is executing a task it will use task memory to record any information it has generated while working on the task.

The current implementation will only clear the task memory when you tell the agent that it's task is complete. This is done to prevent the agent from accidentally clearing its memory if the task was completed incorrectly.

Agent Mimir is based on LangchainJS, every tool or LLM that works on Langchain should also work with Mimir. The prompts are currently tuned on GPT-4 and GPT-3.5 but other models might work.

The tasking system is based on Auto-GPT and BabyAGI where the agent needs to come up with a plan, iterate over its steps and review as it completes the task.

## How to use

### Requirements
You must have installed NodeJS version 18 or above.

### Installation

1. Clone this repository `git clone https://github.com/Altaflux/agent-mimir`
2. Install the required packages `npm install`
3. Copy the .env.example file to .env: cp .env.example .env.
4. In the .env file set the your OpenAI key in `AGENT_OPENAI_API_KEY` and in `AGENT_OPENAI_MODEL` the model you want to use.
5. Start the agent by running `npm run start`


## Customizing Agents

By default Mimir will create an agent with no tools and Chat GPT-3.5. You can configure a custom agent by creating a `mimir-cfg.js` configuration file at the root of the project, use `mimir-cfg.js.example` to start. By configuring an agent you can change its language model to any other model supported by LangchainJS

```javascript

const ChatOpenAI = require('langchain/chat_models/openai').ChatOpenAI;
const WebBrowser = require('langchain/tools/webbrowser').WebBrowser;
const OpenAIEmbeddings = require('langchain/embeddings/openai').OpenAIEmbeddings;
const Serper = require('langchain/tools').Serper;

//Configure your language models, tools and embeddings
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


module.exports = function() {
    return {
        //If continuousMode is set to true the agent will not ask you before executing a tool. Disable at your own risk.
        continuousMode: false,
        agents: {
            'Assistant': { //The name of the agent
                mainAgent: true, //When using multiple agents, set one agent as the mainAgent for the chat.
                chatModel: chatModel, //The main chat LLM used for conversation and memory.
                summaryModel: taskModel, //The model used when summarizing conversations.
                profession: 'an Assistant', //The profession assigned to the agent.
                chatHistory: {
                    maxChatHistoryWindow: 6, //Maximum size of the conversational chat before summarizing. 4 by default
                    maxTaskHistoryWindow: 6, //Maximum size of the task chat before summarizing. 4 by default
                },
                tools: [ //Tools available to the agent.
                    new WebBrowser({
                        model: taskModel,
                        embeddings: embeddings,
                    }),
                    new Serper(),
                    new PowerShell(),
                ],
            }
        }
    }
}
```

## Agent communication:



## Roardmap

* Configurable memory types to allow persistent memory or different use cases.
* Different prompts for different LLMs to improve compatibility.
* Talk to multiple agents simultaneously.
