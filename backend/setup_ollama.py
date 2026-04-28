#!/usr/bin/env python3
"""
Ollama Setup Script for Sugam-AI Solutions ChatBot
This script helps set up Ollama for free, local AI chatbot functionality.
"""

import subprocess
import sys
import time
import requests

def check_ollama_service():
    """Check if Ollama service is running"""
    try:
        response = requests.get('http://localhost:11434/api/tags', timeout=5)
        return response.status_code == 200
    except:
        return False

def pull_model():
    """Pull Llama3 model"""
    try:
        print("📥 Pulling Llama3 model (this may take a few minutes)...")
        result = subprocess.run(['ollama', 'pull', 'llama3:8b'], 
                          capture_output=True, text=True, timeout=600)
        if result.returncode == 0:
            print("✅ Llama3 model downloaded successfully!")
            return True
        else:
            print(f"❌ Error downloading model: {result.stderr}")
            return False
    except subprocess.TimeoutExpired:
        print("❌ Model download timed out. Please try running 'ollama pull llama3:8b' manually.")
        return False
    except FileNotFoundError:
        print("❌ Ollama not found. Please install Ollama first.")
        return False

def main():
    print("🤖 Ollama Setup for Sugam-AI Solutions ChatBot")
    print("=" * 50)
    
    # Check if Ollama is installed and running
    if not check_ollama_service():
        print("❌ Ollama service is not running.")
        print("\n📋 To start Ollama:")
        print("1. Open a new terminal/command prompt")
        print("2. Run: ollama serve")
        print("3. Wait for the service to start")
        print("4. Run this script again")
        return False
    
    print("✅ Ollama service is running!")
    
    # Check if model exists
    try:
        import ollama
        models = ollama.list()
        llama3_exists = any('llama3:8b' in model.get('model', '') for model in models.get('models', []))
        
        if llama3_exists:
            print("✅ Llama3 model is already available!")
        else:
            print("📥 Llama3 model not found. Downloading...")
            if not pull_model():
                return False
    except Exception as e:
        print(f"❌ Error checking models: {e}")
        return False
    
    print("\n🎉 Setup complete!")
    print("Your chatbot is now ready with Ollama + Llama3!")
    print("✨ Features:")
    print("  - 100% FREE forever")
    print("  - No API limits")
    print("  - Runs locally")
    print("  - High-quality responses")
    
    return True

if __name__ == "__main__":
    main()
