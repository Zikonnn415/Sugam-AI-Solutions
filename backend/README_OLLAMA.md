# 🤖 Ollama ChatBot Setup Guide

## 📋 Overview
Your Sugam-AI Solutions chatbot now uses **Ollama**, a completely FREE, local AI service.

## ✨ Benefits
- ✅ **100% FREE forever** - no API costs
- ✅ **Unlimited requests** - no rate limits  
- ✅ **Always available** - runs on your server
- ✅ **Private & secure** - data stays local
- ✅ **High quality** - uses Llama3 8B model

## 🚀 Quick Setup

### Step 1: Install Ollama (if not already installed)
```bash
# Windows
winget install Ollama.Ollama

# Or download from: https://ollama.com/download
```

### Step 2: Start Ollama Service
Open a **new terminal/command prompt** and run:
```bash
ollama serve
```
*Keep this terminal open - it runs the AI service*

### Step 3: Download AI Model
Open **another terminal** and run:
```bash
ollama pull llama3:8b
```
*This downloads the 4.7GB model (one-time only)*

### Step 4: Test the Setup
```bash
python setup_ollama.py
```

## 🔄 Running Your ChatBot

### Development
1. **Terminal 1**: Start Ollama service
   ```bash
   ollama serve
   ```

2. **Terminal 2**: Start Django backend
   ```bash
   cd backend
   python manage.py runserver 0.0.0.0:5000
   ```

3. **Terminal 3**: Start React frontend
   ```bash
   cd frontend/Website
   npm run dev
   ```

### Production
For production deployment, install Ollama on your server and run it as a service.

## 🛠️ Troubleshooting

### "Connection refused" error
- Make sure `ollama serve` is running in a separate terminal
- Check if Ollama is installed: `ollama --version`

### "Model not found" error
- Run: `ollama pull llama3:8b`
- Check available models: `ollama list`

### Slow responses
- Llama3 8B needs good RAM (8GB+ recommended)
- Consider using smaller model: `llama3:8b` → `llama3`

## 📊 Model Options

| Model | Size | Quality | Speed |
|-------|------|---------|---------|
| llama3:8b | 4.7GB | Excellent | Fast |
| llama3 | 4.7GB | Excellent | Fast |
| mistral | 4.1GB | Very Good | Very Fast |
| gemma:7b | 4.8GB | Very Good | Fast |

## 🎯 Your ChatBot Features

Your professional chatbot now includes:
- 🏢 **Company knowledge** - Knows about Sugam-AI Solutions
- 🌍 **Multi-language** - English & Nepali support
- 💼 **Professional responses** - Business-appropriate answers
- 🔄 **Fallback handling** - Graceful error management
- 🎨 **Beautiful UI** - Modern, responsive design

## 🆘 Support

If you need help:
1. Check Ollama status: `ollama list`
2. Verify service: Visit http://localhost:11434
3. Check Django logs for errors
4. Contact: hello@sugamaisolutions.com.np

---

**🎉 Congratulations!** Your chatbot is now 100% free and ready to serve customers!
