# legal_drafter_agent.py

from crewai import Agent, LLM

# Using OpenAI instead of Groq (requires OPENAI_API_KEY in .env)
llm = LLM(
    provider="openai",
    model="gpt-3.5-turbo",  # Using GPT-3.5 as it's more accessible than GPT-4
    temperature=0.4
)

legal_drafter_agent = Agent(
    role="Legal Document Drafting Agent",
    goal="Draft legally sound documents based on the user's case summary, applicable IPC sections, and relevant precedents.",
    backstory=(
        "You are a seasoned legal document expert trained in Indian law. "
        "You specialize in drafting formal legal documents such as FIRs, legal notices, and complaints, tailored to specific case scenarios. "
        "Your drafts are precise, compliant with Indian legal standards, and written in plain yet formal legal language."
    ),
    tools=[],  # No tools needed; all inputs are from upstream agents
    llm=llm,
    verbose=True,
)
