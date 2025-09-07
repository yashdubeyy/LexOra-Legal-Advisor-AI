# ipc_section_agent.py

from crewai import Agent, LLM
from tools.ipc_sections_search_tool import search_ipc_sections

# Using OpenAI instead of Groq (requires OPENAI_API_KEY in .env)
llm = LLM(
    provider="openai",
    model="gpt-3.5-turbo",  # Using GPT-3.5 as it's more accessible than GPT-4
    temperature=0.3
)

ipc_section_agent = Agent(
    role="IPC Section Agent",
    goal="Identify the most relevant Indian Penal Code (IPC) sections based on the legal issue provided.",
    backstory=(
        "You're a seasoned legal researcher with deep knowledge of Indian penal laws. "
        "You specialize in mapping legal issues to applicable IPC sections with precision and clarity. "
        "Your insight helps lawyers and assistants quickly understand the statutory basis of a case."
    ),
    tools=[search_ipc_sections],
    llm=llm,
    verbose=True,
)
