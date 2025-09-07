# test_vectordb.py

import json
import os
import sys
from pathlib import Path

from langchain_community.docstore.document import Document
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings

def main():
    print("Starting vector database creation test...")
    
    # Hard-coded paths for testing
    script_dir = Path(__file__).parent.absolute()
    ipc_json_path = script_dir / "ipc.json"
    persist_dir_path = script_dir / "chroma_vectordb"
    collection_name = "ipc_collection"
    
    print(f"IPC JSON Path: {ipc_json_path}")
    print(f"Persist Directory Path: {persist_dir_path}")
    print(f"Collection Name: {collection_name}")
    
    # Check if IPC JSON file exists
    if not ipc_json_path.exists():
        print(f"Error: IPC JSON file not found at {ipc_json_path}")
        sys.exit(1)
    
    # Load IPC data
    print("Loading IPC data...")
    try:
        with open(ipc_json_path, "r", encoding="utf-8") as file:
            ipc_data = json.load(file)
        print(f"Successfully loaded IPC data: {len(ipc_data)} entries")
    except Exception as e:
        print(f"Error loading IPC data: {e}")
        sys.exit(1)
    
    # Convert to documents
    print("Converting to documents...")
    try:
        documents = [
            Document(
                page_content=f"Section {entry['Section']}: {entry['section_title']}\n\n{entry['section_desc']}",
                metadata={
                    "chapter": entry["chapter"],
                    "chapter_title": entry["chapter_title"],
                    "section": entry["Section"],
                    "section_title": entry["section_title"]
                }
            )
            for entry in ipc_data
        ]
        print(f"Created {len(documents)} document objects")
    except Exception as e:
        print(f"Error creating documents: {e}")
        sys.exit(1)
    
    # Initialize embeddings
    print("Initializing embeddings...")
    try:
        embeddings = HuggingFaceEmbeddings()
        print("Embeddings initialized successfully")
    except Exception as e:
        print(f"Error initializing embeddings: {e}")
        sys.exit(1)
    
    # Create vectorstore
    print("Creating vectorstore...")
    try:
        vectorstore = Chroma.from_documents(
            documents=documents,
            embedding=embeddings,
            persist_directory=str(persist_dir_path),
            collection_name=collection_name
        )
        print(f"Vectorstore successfully created in collection '{collection_name}' at '{persist_dir_path}'")
        
        # Test retrieval
        print("Testing retrieval...")
        query = "theft"
        results = vectorstore.similarity_search(query, k=2)
        print(f"Found {len(results)} results for query '{query}':")
        for doc in results:
            print(f"- {doc.metadata.get('section')}: {doc.metadata.get('section_title')}")
        
        print("Test complete!")
    except Exception as e:
        print(f"Error creating vectorstore: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()