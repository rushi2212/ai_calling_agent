import os

from dotenv import load_dotenv
from groq import Groq


def check_groq(model_name: str) -> bool:
    try:
        client = Groq(api_key=os.getenv("GROQ_API_KEY", ""))
        completion = client.chat.completions.create(
            model=model_name,
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": "Say hello in one short sentence."},
            ],
            temperature=0.2,
            max_tokens=50,
        )
        print(f"Groq OK ({model_name}): {completion.choices[0].message.content}")
        return True
    except Exception as error:
        print(f"Groq FAIL ({model_name}): {error}")
        return False


def main() -> None:
    load_dotenv()

    groq_model = os.getenv("GROQ_MODEL", "llama-3.1-70b-versatile")

    print("--- Groq ---")
    check_groq(groq_model)


if __name__ == "__main__":
    main()
