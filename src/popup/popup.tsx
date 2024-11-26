import React, { useEffect, useState, useRef } from 'react'
import { createRoot } from 'react-dom/client'
import '../assets/tailwind.css'
import Card from '../components/Card'
import formatViolations from '../util/formatViolations'
import ChatLog from '../components/ChatLog'
import { Button } from '../components/Buttons'

const VIOLATION_URL = 'http://localhost:5000/violations'
const CHAT_URL = 'http://localhost:5000/chat'

type chatLog = {
    message: string,
    agent: string
}

const Popup = () => {
    const [violations, setViolations] = useState([])
    const [chatLog, setChatLog] = useState<chatLog[]>([])
    const [input, setInput] = useState('')

    const inputRef = useRef(null)

    // generating violations logic
    const [generatingViolations, setGeneratingViolations] = useState(false)
    const [generatingViolationsText, setGeneratingViolationsText] = useState('Generating Violations')

    // Loading Logic
    const [loading, setLoading] = useState(false)
    const [loadingText, setLoadingText] = useState('Loading')

    useEffect(() => {
        const interval = setInterval(() => {
            if (loading) {
                setLoadingText((prevText) => {
                    if (prevText === 'Loading...') return 'Loading'
                    else if (prevText === 'Loading') return 'Loading.'
                    else if (prevText === 'Loading.') return 'Loading..'
                    else if (prevText === 'Loading..') return 'Loading...'
                })
            }
            if (generatingViolations) {
                setGeneratingViolationsText((prevText) => {
                    if (prevText === 'Generating Violations...') return 'Generating Violations'
                    else if (prevText === 'Generating Violations') return 'Generating Violations.'
                    else if (prevText === 'Generating Violations.') return 'Generating Violations..'
                    else if (prevText === 'Generating Violations..') return 'Generating Violations...'
                })
            }
        }, 200)
        return () => clearInterval(interval)
    }, [loading, generatingViolations])

    useEffect(() => {
        chrome.tabs.query({active: true, currentWindow: true}, tabs => {
            const tabId = tabs[0].id;
            chrome.storage.local.get([`violations_${tabId}`], function(result) {
                setViolations(result[`violations_${tabId}`] || [])
            })
            chrome.storage.local.get([`chatLog_${tabId}`], function(result) {
                setChatLog(result[`chatLog_${tabId}`] || [])
            })
        })
    }, [])

    const handleClick = async () => {
        setGeneratingViolations(true)
        let response = await chrome.runtime.sendMessage({ message: 'buttonClicked' })
        setGeneratingViolations(false)
        console.log("Violations from background.ts: ", response.violations)
        setViolations(response.violations)
        chrome.tabs.query({active: true, currentWindow: true}, tabs => {
            const tabId = tabs[0].id;
            chrome.storage.local.set({ [`violations_${tabId}`]: response.violations });
        })
    }

    const handleClearViolations = () => {
        setViolations([])
        chrome.tabs.query({active: true, currentWindow: true}, tabs => {
            const tabId = tabs[0].id;
            chrome.storage.local.set({ [`violations_${tabId}`]: [] });
        })
        chrome.runtime.sendMessage({ message: 'clearViolations' });
    }
     
    const updateChatLog = async (url, message, agent) => {
        setLoading(true)
        const newChatLog = [...chatLog, { message, agent}]
        setChatLog(newChatLog)
        chrome.tabs.query({active: true, currentWindow: true}, tabs => {
            const tabId = tabs[0].id;
            chrome.storage.local.set({ [`chatLog_${tabId}`]: newChatLog })
        })
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chatLog: newChatLog
            })
        })
        const data = await response.json()
        
        const updatedChatLog = [...newChatLog, { message: data.message, agent: 'agent' }]
        setChatLog(updatedChatLog)
        chrome.tabs.query({active: true, currentWindow: true}, tabs => {
            const tabId = tabs[0].id;
            chrome.storage.local.set({ [`chatLog_${tabId}`]: updatedChatLog })
        })
        setLoading(false)
    }

    const handleClearChatLog = () => {
        setChatLog([])
        chrome.tabs.query({active: true, currentWindow: true}, tabs => {
            const tabId = tabs[0].id;
            chrome.storage.local.set({ [`chatLog_${tabId}`]: [] });
        })
    }

    const getSuggestions = async (e) => {
        e.preventDefault()
        const descriptions = formatViolations(violations)
        await updateChatLog(VIOLATION_URL, descriptions, 'Violation(s)')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (inputRef.current) {
            inputRef.current.focus()
        }
        const message = input.trim()
        setInput('')
        await updateChatLog(CHAT_URL, message, 'user')
    }

    return (
        <div className='flex flex-col w-full h-screen'>
            <nav className='fixed top-0 left-0 right-0 flex justify-around items-center p-4 bg-gray-900 text-black shadow-md'>
                <div className='flex space-x-1'>
                    <Button onClick={handleClick} className='px-4 bg-gray-400 hover:bg-gray-500 rounded'>
                        View Violations
                    </Button>
                    <Button onClick={handleClearViolations} className='px-4 bg-gray-400 hover:bg-gray-500 rounded'>
                        Clear Violations
                    </Button>
                    <Button onClick={getSuggestions} disabled={violations.length === 0} className='px-4 bg-gray-500 hover:bg-green-700 rounded'>
                        Get Suggestions
                    </Button>
                    <Button onClick={handleClearChatLog} className='px-4 bg-gray-400 hover:bg-gray-500 rounded'>
                        Reset Chat
                    </Button>
                </div>
            </nav>
            <div className='mt-24 mb-4'>
                {generatingViolations ? <div className='flex items-center justify-center space-x-2'>
                    <svg className='animate-spin h-5 w-5 text-blue-500' 
                        xmlns='http://www.w3.org/2000/svg' 
                        fill='none' 
                        viewBox='0 0 24 24'>
                        <circle 
                            className='opacity-25' 
                            cx='12' 
                            cy='12' 
                            r='10' 
                            stroke='currentColor' 
                            strokeWidth='4'>
                        </circle>
                        <path 
                            className='opacity-75' 
                            fill='currentColor' 
                            d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'>
                        </path>
                    </svg>
                    <span className='text-lg font-medium text-gray-700'>{generatingViolationsText}</span>
                </div> : 
                <ul className='px-2'>
                    {violations.map((violation, index) => (
                        <Card key={index} violation={violation} index={index}/>
                    ))}
                </ul>}
            </div>
            <ChatLog chatLog={chatLog} loading={loading}/>
            <div className='sticky bottom-0 left-0 right-0 justify-center items-center flex h-12'>
                <form onSubmit={handleSubmit} className='flex justify-center w-full'>
                    <input
                        ref={inputRef}
                        className='
                            w-3/4
                            mx-auto
                            p-2
                            rounded-md 
                            border-2 
                            border-gray-300 
                            focus:outline-none 
                            focus:border-blue-500
                            disabled:bg-white
                            font-size-lg
                        '
                        value={input} 
                        onChange={(e) => setInput(e.target.value)} 
                        placeholder={`${loading ? loadingText : 'Type your message here...'}`}
                        disabled={loading}
                    >
                            
                    </input>
                </form>
            </div>
        </div>
    )
}

const container = document.createElement('div')
document.body.appendChild(container)
const root = createRoot(container)
root.render(<Popup />)