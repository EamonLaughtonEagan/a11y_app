import React, { useEffect, useState, useRef } from 'react'
import { createRoot } from 'react-dom/client'
import '../assets/tailwind.css'
import Card from '../components/Card'
import formatViolations from '../util/formatViolations'
import ChatLog from '../components/ChatLog'
import { Button } from '../components/Buttons'
import Spinner from '../components/Spinner'
import Header from '../components/Header'

//TODO: Change this to the server's URL
const BASE_URL = 'http://172.105.106.240'
const VIOLATION_URL = `${BASE_URL}/violations`
const CHAT_URL = `${BASE_URL}/chat`

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
            chrome.storage.local.get([`violations_${tabId}`, `chatLog_${tabId}`, `violationsGenerated_${tabId}`], function(result) {
                setViolations(result[`violations_${tabId}`] || [])
                setChatLog(result[`chatLog_${tabId}`] || [])
                if (!result[`violationsGenerated_${tabId}`]) {
                    handleGenerateViolations(tabId);
                }
            })
        })
    }, [])

    useEffect(() => {
        chrome.runtime.sendMessage({ message: 'renderContentScript' });
    }, [])


    // save chat log to local storage so it persists between popup reloads
    useEffect(() => {
        chrome.tabs.query({active: true, currentWindow: true}, tabs => {
            const tabId = tabs[0].id;
            chrome.storage.local.set({ [`chatLog_${tabId}`]: chatLog })
        })
    }, [chatLog])

    const handleGenerateViolations = async (tabId: number) => {
        setGeneratingViolations(true)
        let response = await chrome.runtime.sendMessage({ message: 'buttonClicked' })
        setGeneratingViolations(false)
        console.log("Violations from background.ts: ", response.violations)
        setViolations(response.violations)
        chrome.tabs.query({active: true, currentWindow: true}, tabs => {
            chrome.storage.local.set({ [`violations_${tabId}`]: response.violations, 
            [`violationsGenerated_${tabId}`]: true });
        })
    }

    const handleClearViolations = () => {
        setViolations([])
        chrome.tabs.query({active: true, currentWindow: true}, tabs => {
            const tabId = tabs[0].id;
            chrome.storage.local.set({ [`violations_${tabId}`]: [], 
            [`violationsGenerated_${tabId}`]: false });
        })
        chrome.runtime.sendMessage({ message: 'clearViolations' });
    }
     
    const updateChatLog = async (url: string | URL | Request, message: string, agent: string) => {
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

    const handleGenerateViolationsButtonClick = () => {
        chrome.tabs.query({active: true, currentWindow: true}, tabs => {
            const tabId = tabs[0].id;
            handleClearViolations();
            handleGenerateViolations(tabId);
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
            <Header />
            <div className='mt-2 mb-2'>
                {generatingViolations ? <Spinner text={generatingViolationsText}/> 
                : 
                <div>
                    <ul className='px-2 space-y-2'>
                        {violations.map((violation, index) => (
                            <Card key={index} violation={violation} index={index}/>
                        ))}
                    </ul>
                </div>}
            </div>
            <ChatLog chatLog={chatLog} loading={loading}/>
            {loading && 
                <div className='w-full flex justify-start font-semibold text-md px-4 pb-4 font-mono'>
                    {loadingText}
                </div>
            }
            <div className='sticky bottom-0 left-0 right-0 justify-center items-center flex h-12 pb-2 px-4 space-x-1'>
                    <Button 
                        popup='regenerate violations on this page' 
                        onClick={handleGenerateViolationsButtonClick} 
                        disabled={generatingViolations}
                        className='hover:bg-gray-300 bg-white'
                    >
                        Generate
                    </Button>
                    <Button 
                        popup='clear violations on page' 
                        onClick={handleClearViolations}
                        className='hover:bg-gray-300 bg-white'
                    >
                        Clear
                    </Button>
                    <Button 
                        popup='generates AI suggestions' 
                        onClick={getSuggestions} 
                        disabled={violations.length === 0}
                        className='hover:bg-gray-300 bg-white'
                    >
                        Suggestions
                    </Button>
                <div className='flex justify-end w-full space-x-1'>
                    <Button 
                        onClick={handleSubmit}
                        className='hover:bg-gray-300 bg-white'
                    >
                        Send
                    </Button>
                    <form onSubmit={handleSubmit} >
                        <input
                            ref={inputRef}
                            className='
                                w-full
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
                            placeholder={`${loading ? loadingText : 'chat with assistant...'}`}
                            disabled={loading}
                        >
                        </input>
                    </form>
                    <Button 
                        popup='clear the chat log and AI memory' 
                        onClick={handleClearChatLog}
                        className='hover:bg-gray-300 bg-white'
                    >
                        Reset
                    </Button>
                </div>
            </div>
        </div>
    )
}

const container = document.createElement('div')
document.body.appendChild(container)
const root = createRoot(container)
root.render(<Popup />)