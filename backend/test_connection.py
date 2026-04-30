#!/usr/bin/env python3
"""
Test script to verify the chatbot API is working
"""
import requests
import json

def test_chatbot_api():
    """Test the chatbot API endpoint"""
    url = 'http://localhost:5000/api/chat/'
    data = {'message': 'Hello, test message'}
    
    
    try:
        print(f"Testing POST to {url}")
        print(f"Data: {data}")
    
        response = requests.post(url, json=data, timeout=10)
        
        print(f"Status Code: {response.status_code}")
        print(f"Headers: {dict(response.headers)}")
    
        if response.status_code == 200:
            result = response.json()
            print(f"✅ SUCCESS!")
            print(f"Response: {result['response'][:100]}...")
            return True
        else:
            print(f"❌ FAILED with status {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ CONNECTION REFUSED - Backend server not running")
        return False
    except requests.exceptions.Timeout:
        print("❌ TIMEOUT - Server took too long to respond")
        return False
    except Exception as e:
        print(f"❌ ERROR: {e}")
        return False

if __name__ == "__main__":
    print("🔍 Testing ChatBot API Connection")
    print("=" * 40)
    test_chatbot_api()
