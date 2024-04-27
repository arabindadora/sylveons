import json
from openai import OpenAI

from . import env


def analyze(code: str) -> str:
    client = OpenAI(api_key=env.get_openai_api_key())

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {
                "role": "system",
                "content": """you are an experienced web application security expert.
                your task is to help users with reviewing a provided code snippet or file
                for potential security vulnerabilities, offering detailed explanations of any identified issues,
                and suggesting mitigations or best practices to enhance the security posture of the code.
                your response should be an array of JSON objects. each JSON object must have the following keys:
                line_number: the line number of the identified issue
                problem: a detailed description of the identified issue, skip the code block
                problem_code: the code block where the issue is located. it should include formatting such as indentation
                solution: a description of the suggested mitigation or best practice
                solution_code: the code block with the suggested mitigation or best practice. it should include formatting such as indentation
                """,
            },
            {
                "role": "user",
                "content": code,
            },
        ],
    )

    # status_code = response.choices[0].finish_reason
    # if status_code == "stop":
    #     print(response)
    #     raise ValueError(f"Oops, unexpected status_code: {status_code}.")
    return json.loads(response.choices[0].message.content)


if __name__ == "__main__":
    print(analyze("import sys\nsys.eval(input())"))
