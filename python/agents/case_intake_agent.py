# case_intake_agent.py

from crewai import Agent, LLM


# agent specific LLM - using OpenAI instead of Groq (requires OPENAI_API_KEY in .env)
llm = LLM(
    provider="openai",
    model="gpt-3.5-turbo",  # Using GPT-3.5 as it's more accessible than GPT-4
    temperature=0
)

case_intake_agent = Agent(
    role="Case Intake Agent",
    goal=(
        "Understand the user's legal issue and classify it into a"
         " structured format for further legal processing."
    ),
    backstory=(
        "You're a highly skilled legal intake assistant trained to analyze"
        " plain-English legal concerns. "
        "You identify the type of legal issue, categorize it under a domain of law,"
        " and extract relevant context "
        "to pass along to legal researchers, drafters, or compliance teams."
    ),
    llm=llm,
    tools=[],
    verbose=True,
)

