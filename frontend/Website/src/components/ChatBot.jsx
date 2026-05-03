import { useState, useRef, useEffect } from 'react'
import { Send, Minus, Maximize2, MessageCircle, X, Bot, User } from 'lucide-react'

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! Welcome to Sugam-AI Solutions. I'm here to help you with information about our AI services. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Professional responses based on keywords
  const getBotResponse = (userMessage) => {
    const msg = userMessage.toLowerCase()
    
    // Greetings
    if (msg.match(/\b(hello|hi|hey|greetings|good morning|good afternoon|good evening)\b/)) {
      return "Hello! Welcome to Sugam-AI Solutions. I'm your virtual assistant and I'm here to help you explore our AI services. What would you like to know about?"
    }
    
    // Services inquiry
    if (msg.match(/\b(service|services|offer|provide|do you do|what do you|solutions)\b/)) {
      return "We offer comprehensive AI solutions including: AI Prototyping, Virtual Assistants, Data Engineering, ML Consulting, and Cloud Integration. We specialize in Finance, Tourism, Retail, Healthcare, and Government sectors. Which service would you like to learn more about?"
    }
    
    // Contact information
    if (msg.match(/\b(contact|email|phone|call|reach|address|location|where are you)\b/)) {
      return "You can reach us at:\n📧 Email: hello@sugamaisolutions.com.np\n📞 Phone: +977-1-5551234\n📍 Address: Hattisar, Kathmandu 44600, Nepal\n\nWe're available Monday to Friday, 9:00 AM - 6:00 PM."
    }
    
    // Pricing
    if (msg.match(/\b(price|pricing|cost|how much|fees|budget|charge|payment)\b/)) {
      return "We offer customized pricing based on your specific project requirements. We provide free initial consultations to understand your needs and provide a tailored quote. Please contact us at +977-1-5551234 or hello@sugamaisolutions.com.np for detailed pricing information."
    }
    
    // About company
    if (msg.match(/\b(about|company|who are you|sugam-ai|your company|tell me about)\b/)) {
      return "Sugam-AI Solutions is a leading AI company based in Kathmandu, Nepal. We help businesses transform through cutting-edge artificial intelligence solutions. Our mission is to empower Nepali businesses with world-class AI technology."
    }
    
    // Team/Founder
    if (msg.match(/\b(team|founder|sugam shrestha|who built|who made|developer)\b/)) {
      return "Sugam-AI Solutions was founded by Sugam Shrestha, a passionate technologist dedicated to bringing AI innovation to Nepal. Our team consists of skilled AI engineers, data scientists, and consultants committed to delivering excellence."
    }
    
    // Case studies/portfolio
    if (msg.match(/\b(case study|portfolio|work|project|client|example|previous)\b/)) {
      return "We have successfully delivered AI solutions across various sectors. Visit our Case Studies page to see detailed examples of our work in Finance, Tourism, Retail, Healthcare, and Government sectors."
    }
    
    // Blog/Articles
    if (msg.match(/\b(blog|article|news|read|learn|knowledge)\b/)) {
      return "Check out our Blog section for insightful articles about AI trends, case studies, and industry updates. We regularly share valuable content to help you stay informed about the latest in artificial intelligence."
    }
    
    // Testimonials
    if (msg.match(/\b(testimonial|review|feedback|client say|customers|rating)\b/)) {
      return "Our clients appreciate our professional approach and quality solutions. Visit our Testimonials page to read what our clients say about working with Sugam-AI Solutions."
    }
    
    // Events
    if (msg.match(/\b(event|events|webinar|seminar|workshop|upcoming)\b/)) {
      return "We regularly host and participate in AI events, webinars, and workshops. Visit our Events page to see upcoming activities and register for our latest sessions."
    }
    
    // AI/Technology questions
    if (msg.match(/\b(ai|artificial intelligence|machine learning|ml|technology|how does it work)\b/)) {
      return "Artificial Intelligence (AI) and Machine Learning (ML) are technologies that enable computers to learn from data and make intelligent decisions. At Sugam-AI Solutions, we use these technologies to automate processes, predict outcomes, and create intelligent systems for businesses."
    }
    
    // Industries/Sectors
    if (msg.match(/\b(finance|tourism|retail|healthcare|government|sector|industry|field)\b/)) {
      return "We specialize in multiple sectors:\n\n🏦 Finance - Fraud detection, risk analysis, automated trading\n✈️ Tourism - Personalized recommendations, chatbots, booking optimization\n🛍️ Retail - Inventory management, customer analytics, demand forecasting\n🏥 Healthcare - Diagnostic assistance, patient management, medical imaging\n🏛️ Government - Smart governance, data analytics, citizen services\n\nWhich sector interests you?"
    }
    
    // Careers/Jobs
    if (msg.match(/\b(career|job|work|hiring|join|position|employment|opportunity)\b/)) {
      return "We're always looking for talented individuals passionate about AI. Send your resume to hello@sugamaisolutions.com.np with the subject line 'Career Application'. We'd love to hear from you!"
    }
    
    // Support/Help
    if (msg.match(/\b(help|support|assist|problem|issue|error|not working)\b/)) {
      return "I'm here to help! For technical support or any issues, please contact us directly:\n\n📧 Email: hello@sugamaisolutions.com.np\n📞 Phone: +977-1-5551234\n\nOur support team will assist you promptly."
    }
    
    // Time/Hours
    if (msg.match(/\b(hour|hours|time|open|when|available|working hours)\b/)) {
      return "Our business hours are:\nMonday - Friday: 9:00 AM - 6:00 PM\nSaturday - Sunday: Closed\n\nYou can contact us anytime via email at hello@sugamaisolutions.com.np and we'll respond within 24 hours."
    }
    
    // Thank you
    if (msg.match(/\b(thank|thanks|thank you|appreciate|grateful)\b/)) {
      return "You're welcome! I'm glad I could help. If you have any other questions about Sugam-AI Solutions or our services, feel free to ask. Have a great day!"
    }
    
    // Goodbye
    if (msg.match(/\b(bye|goodbye|see you|talk later|exit|close)\b/)) {
      return "Thank you for chatting with us! Feel free to reach out anytime if you have questions. Have a wonderful day! 👋"
    }
    
    // Default response
    return "Thank you for your message! I'm here to help with information about Sugam-AI Solutions and our AI services. You can ask me about our services, contact information, pricing, or anything else about the company. What would you like to know?"
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus()
    }
  }, [isOpen, isMinimized])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    
    if (!inputMessage.trim()) return

    const userMsg = {
      id: Date.now(),
      text: inputMessage.trim(),
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMsg])
    setInputMessage('')
    setIsTyping(true)

    // Simulate typing delay for natural feel
    setTimeout(() => {
      const botResponse = getBotResponse(inputMessage.trim())
      
      const botMsg = {
        id: Date.now() + 1,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, botMsg])
      setIsTyping(false)
    }, 500)
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 group"
        style={{
          boxShadow: '0 8px 32px -8px rgba(79, 70, 229, 0.5)'
        }}
      >
        <MessageCircle className="w-6 h-6 group-hover:rotate-12 transition-transform" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
      </button>
    )
  }

  return (
    <div 
      className={`fixed bottom-6 right-6 z-50 bg-slate-900 rounded-2xl shadow-2xl border border-indigo-500/20 transition-all duration-300 ${
        isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
      }`}
      style={{
        boxShadow: '0 20px 60px -10px rgba(79, 70, 229, 0.4)',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-indigo-500/20 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-t-2xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold">AI Assistant</h3>
            <p className="text-xs text-green-400 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Online
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            {isMinimized ? <Maximize2 className="w-4 h-4 text-slate-400" /> : <Minus className="w-4 h-4 text-slate-400" />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[calc(100%-8rem)]">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-3 ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.sender === 'bot' && (
                  <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                )}
                
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white ml-auto'
                      : 'bg-slate-800 text-slate-200 border border-slate-700'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                  <p className={`text-xs mt-2 ${
                    message.sender === 'user' ? 'text-indigo-200' : 'text-slate-500'
                  }`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>

                {message.sender === 'user' && (
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-slate-800 text-slate-200 border border-slate-700 p-3 rounded-2xl">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-indigo-500/20">
            <div className="flex items-center space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-slate-800 text-white placeholder-slate-400 px-4 py-3 rounded-xl border border-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                disabled={isTyping}
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isTyping}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  )
}

export default ChatBot
