#!/usr/bin/env python3
"""
Test Ollama integration directly
"""
import ollama

def test_ollama():
    try:
        # Test basic connection
        print("Testing Ollama connection...")
        models = ollama.list()
        print(f"Available models: {models}")
        
        # Test chat
        print("\nTesting chat...")
        response = ollama.chat(
            model='llama3:8b',
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": "Hello, how are you?"}
            ]
        )
        print(f"Response: {response['message']['content']}")
        return True
        
    except Exception as e:
        print(f"Error: {e}")
        return False

if __name__ == "__main__":
    test_ollama()
