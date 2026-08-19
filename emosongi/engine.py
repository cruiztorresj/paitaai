from langchain.chat_models import init_chat_model
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers.json import JsonOutputParser

from .music import Songs

import random

class Engine:
    @staticmethod
    def get_associated_feeling(emoji_id):
        emojid = 1
        try:
            emojid = int(emoji_id)

            associated_feelings = {
                1: ['love', 'affection', 'devotion', 'fondness', 'tenderness'],
                2: ['party', 'celebrate', 'diversion', 'fun', 'party-music'],
                3: ['smiling', 'content', 'happy', 'laugh', 'favorable'],
                4: ['angry', 'mad', 'furious', 'rage', 'irritated'],
                5: ['melting', 'emotional', 'arouse', 'admiration'],
                6: ['sleepy', 'somnolent', 'yawn', 'low energy'],
                7: ['joy', 'bliss', 'happy', 'laugh', 'excited'],
                8: ['lies', 'deception', 'treacherous', 'mythomaniac', 'dishonest'],
                9: ['broken heart', 'sad', 'out of love', 'loneliness', 'heartbreaking'],
                10: ['hugging', 'comfort', 'companion', 'camaraderie', 'comprehension']
            }

            return random.choice(associated_feelings[emojid])
        except:
            return 'love'

    @staticmethod
    def get_song(feeling):

        model = init_chat_model("mistral-small-latest",
                                model_provider="mistralai",
                                temperature = 0.7,
                                max_tokens = 256)

        template = """Give a me a list of songs expressing {emotion}.
                No description.
                {format_instructions}"""

        parser = JsonOutputParser(pydantic_object=Songs)

        prompt = PromptTemplate.from_template(template,
            partial_variables=
                {"format_instructions": parser.get_format_instructions()}
                                      )
        llm_chain = prompt | model | parser

        response = llm_chain.invoke(input = {"emotion": feeling})

        songs = response['recommendations']
        song = random.choice(songs)

        answer = {'song': song['name'],  'singer': song['singer']}

        return answer
