'use client'

import { useState, useRef, useEffect } from 'react'

interface Source {
  title: string
  url: string
}

interface Message {
  id: number
  role: 'user' | 'assistant'
  content: string
  sources?: Source[]
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, loading])

  const handleSend = async () => {
    const query = inputValue.trim()
    if (!query || loading) return

    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      content: query,
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setLoading(true)

    try {
      const response = await fetch('https://prd.myintent.cc/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': '6da6809e6d11d6f3edde32040650ceebe7537597f0097549',
        },
        body: JSON.stringify({ query }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Request failed')
      }

      const assistantMessage: Message = {
        id: Date.now(),
        role: 'assistant',
        content: data.answer,
        sources: data.sources?.slice(0, 3).map((s: { title: string; url: string }) => ({
          title: s.title,
          url: s.url,
        })),
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('API call failed:', error)

      const errorMessage: Message = {
        id: Date.now(),
        role: 'assistant',
        content: '抱歉，查询失败了，请稍后重试。',
      }

      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* 欢迎消息 */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-5xl mb-4">📚</div>
            <div className="text-xl font-semibold text-gray-800 mb-2">
              PRD 问答助手
            </div>
            <div className="text-sm text-gray-500">
              有什么关于产品需求的问题？随时问我！
            </div>
          </div>
        )}

        {/* 消息气泡 */}
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex flex-col mb-4 max-w-[85%] ${
              message.role === 'user'
                ? 'self-end items-end ml-auto'
                : 'self-start items-start'
            }`}
          >
            <div
              className={`px-4 py-3 rounded-2xl break-words ${
                message.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-sm'
                  : 'bg-white text-gray-800 rounded-bl-sm shadow-sm'
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {message.content}
              </p>
            </div>

            {/* 来源链接 */}
            {message.sources && message.sources.length > 0 && (
              <div className="mt-2 px-3 py-2 bg-gray-50 rounded-lg text-xs">
                <span className="text-gray-500">来源：</span>
                {message.sources.map((source, index) => (
                  <span key={source.url}>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:underline ml-1"
                    >
                      {source.title}
                    </a>
                    {index < message.sources!.length - 1 && (
                      <span className="text-gray-400">、</span>
                    )}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* 加载中 */}
        {loading && (
          <div className="flex flex-col mb-4 max-w-[85%] self-start items-start">
            <div className="px-5 py-4 bg-white rounded-2xl rounded-bl-sm shadow-sm flex items-center gap-1">
              <div className="dot w-2 h-2 bg-gray-400 rounded-full" />
              <div className="dot w-2 h-2 bg-gray-400 rounded-full" />
              <div className="dot w-2 h-2 bg-gray-400 rounded-full" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 输入区域 */}
      <div className="flex items-center gap-3 p-4 bg-white border-t border-gray-200 pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <input
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="输入你的问题..."
          disabled={loading}
          className="flex-1 h-10 px-4 bg-gray-100 rounded-full text-sm outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
        />
        <button
          onClick={handleSend}
          disabled={loading || !inputValue.trim()}
          className="h-10 px-5 bg-indigo-600 text-white text-sm font-medium rounded-full disabled:bg-gray-400 hover:bg-indigo-700 transition-colors"
        >
          发送
        </button>
      </div>
    </div>
  )
}
