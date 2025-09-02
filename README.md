# PaitaAI

Artificial Intelligence (AI) explorations, I am referring to the exploration of available products to enrich applications with AI features, this repository is not related with heavy-lifting AI theory.
The repository is a [Django](https://www.djangoproject.com) project consisting of several applications. Being Emosongi the first one to be implemented.

## Emosongi
[Emosongi](https://calebjosue.pythonanywhere.com/emosongi) is a web application to portray an idea I came up when taking some free online training related to [LangChain](https://www.langchain.com). You click on an emoji and an LLM will recommend a song for you. We are using [MistralAI](https://mistral.ai) for the last part.
You should be able to run this project locally by means of
* Cloning the project.
* Change directory in to the recently cloned project.
* Create a `.env` file with the following content: `MISTRAL_API_KEY:YOUR_API_KEY_VALUE`
* Execute `python manage.py runserver`

Of course you have the required dependencies already installed.
