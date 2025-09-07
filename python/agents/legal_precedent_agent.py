# legal_precedent_agent.py

from crewai import Agent, LLM
from tools.legal_precedent_search_tool import search_legal_precedents

# Using OpenAI instead of Groq (requires OPENAI_API_KEY in .env)
llm = LLM(
    provider="openai",
    model="gpt-3.5-turbo",  # Using GPT-3.5 as it's more accessible than GPT-4
    temperature=0
)

legal_precedent_agent = Agent(
    role="Legal Precedent Agent",
    goal="Find relevant legal precedent cases based on the user's legal issue.",
    backstory=(
        "You're an expert legal researcher who specializes in finding case law and precedent judgments. "
        "You are skilled in identifying relevant case summaries based on natural language descriptions of legal issues. "
        "Your task is to search trusted legal databases to support legal analysis with past judgments."
    ),
    tools=[search_legal_precedents],
    llm=llm,
    verbose=True,
)
