import React, { useEffect, useState, useRef } from 'react'
import { createRoot } from 'react-dom/client'
import '../assets/tailwind.css'
import Card from '../components/Card'
import formatViolations from '../util/formatViolations'
import ChatLog from '../components/ChatLog'
import { Button } from '../components/Buttons'
import Spinner from '../components/Spinner'
import Header from '../components/Header'
import { chatLog, solution } from '../static/types'

//TODO: Change this to the server's URL
// export const BASE_URL =  'http://172.105.106.240'
export const BASE_URL = 'http://localhost:5000'

const VIOLATION_URL = `${BASE_URL}/violations`
const CHAT_URL = `${BASE_URL}/chat`
const HELP_URL = `${BASE_URL}/help`

const Popup = () => {
    const [violations, setViolations] = useState([])
    const [chatLog, setChatLog] = useState<chatLog[]>([])
    //const [response, setResponse] = useState<solution[]>([])
    const [input, setInput] = useState('')

    const inputRef = useRef(null)

    // generating violations logic
    const [generatingViolations, setGeneratingViolations] = useState(false)
    const [generatingViolationsText, setGeneratingViolationsText] = useState('Generating Violations')

    // generating suggestions logic
    const [GeneratingSuggestions, setGeneratingSuggestions] = useState(false)
    const [GeneratingSuggestionsText, setGeneratingSuggestionsText] = useState('Generating')
    const [violationsGenerated, setViolationsGenerated] = useState(false);

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
            if (GeneratingSuggestions) {
                setGeneratingSuggestionsText((prevText) => {
                    if (prevText === 'Generating...') return 'Generating'
                    else if (prevText === 'Generating') return 'Generating.'
                    else if (prevText === 'Generating.') return 'Generating..'
                    else if (prevText === 'Generating..') return 'Generating...'
                })
            }
        }, 200)
        return () => clearInterval(interval)
    }, [loading, generatingViolations, GeneratingSuggestions])

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
        if (violationsGenerated) {
        const fetchViolations = async (url: string) => {
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        descriptions: violations.map((violation) => violation.description).join(', '),
                    })
                });
                const data = await response.json();
                const initialChatLog = JSON.parse(data.message).violations.map((violation, index) => ({
                    message: `violation ${index+1}: ${violation.solution}`,
                    agent: 'system'
                }));
                setChatLog(initialChatLog);
                chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
                    const tabId = tabs[0].id;
                    chrome.storage.local.set({ [`chatLog_${tabId}`]: initialChatLog });
                });
                setLoading(false);
            } catch (error) {
                console.error('Error fetching violations:', error);
                setLoading(false);
            }
        };
        fetchViolations(HELP_URL);
    } else {
        return
    }

        
    }, [violationsGenerated]);

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
        setViolations(response.violations)
        chrome.tabs.query({active: true, currentWindow: true}, tabs => {
            chrome.storage.local.set({ [`violations_${tabId}`]: response.violations, 
            [`violationsGenerated_${tabId}`]: true });
        })
        setViolationsGenerated(true)

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
        console.log(chatLog)
    }

    //testing out new way to render suggestion from AI 
    const getHelp = async (url: string) => {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({
                violations: violations,
                descriptions: violations.map((violation) => violation.description).join(', '),
                help: violations.map((violation) => violation.help)
            })
        })
        const data = await response.json()
        const parsedData = JSON.parse(data.message)
        const stringData = data.message
        //setChatLog([...chatLog, { message: stringData, agent: 'initialization' }])
        //console.log('parsedData: ', parsedData)
        //console.log('stringData: ', stringData)
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
        <div className='flex flex-col w-full h-full '>
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
            <div className='sticky bottom-0 left-0 right-0 justify-start items-center flex h-12 py-2 px-4 space-x-1 bg-gray-300 border shadow-lg rounded-lg'>
                    <Button 
                        popup='regenerate violations on this page' 
                        onClick={handleGenerateViolationsButtonClick} 
                        disabled={generatingViolations}
                        className='hover:bg-gray-400 hover:text-white bg-white'
                    >
                        Generate
                    </Button>
                    <Button 
                        popup='clear violations on page' 
                        onClick={handleClearViolations}
                        className='hover:bg-gray-400 hover:text-white bg-white'
                    >
                        Clear
                    </Button>
            <div className='flex justify-end w-full space-x-1'>
                <Button 
                    onClick={handleSubmit}
                    className='hover:bg-gray-400 hover:text-white bg-white'
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
                    className='hover:bg-gray-400 hover:text-white bg-white'
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