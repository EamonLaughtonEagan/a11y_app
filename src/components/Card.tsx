import React, { useEffect, useRef, useState } from 'react';
import '../assets/tailwind.css'
import { Button } from './Buttons';
import { BASE_URL } from '../popup/popup';
import { chatLog, solution } from '../static/types';

const getImpactColour = (impact) => {
    switch (impact) {
        case 'minor':
            return 'bg-yellow-200'
        case 'moderate':
            return 'bg-orange-200'
        case 'serious':
            return 'bg-red-200'
        case 'critical':
            return 'bg-red-600'
        default:
            return 'bg-gray-200'
    }
}

const handleScrollToViolation = (index: number) => {
    chrome.runtime.sendMessage({ message: 'scrollToViolation', index: index });
}

const Card = ({ violation, index }) => {
    const [chat, setChat] = useState<chatLog[]>([]);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatingText, setGeneratingText] = useState('Generating');
    const [input, setInput] = useState('');
    const [fix, setFix] = useState<solution>(null);
    const [loading, setIsLoading] = useState(false);

    const inputRef = useRef(null)

    const CHAT_URL = `${BASE_URL}/chat/${index}`

    const handleMouseEnter = () => {
        chrome.runtime.sendMessage({ message: 'hoverCard', action: 'enter', index: index})
    }

    const handleMouseLeave = () => {
        chrome.runtime.sendMessage({ message: 'hoverCard', action: 'leave', index: index})
    }

    useEffect(() => {
        const interval = setInterval(() => {
            if (isGenerating) {
                setGeneratingText((prevText) => {
                    if (prevText === 'Generating...') return 'Generating'
                    else if (prevText === 'Generating') return 'Generating.'
                    else if (prevText === 'Generating.') return 'Generating..'
                    else if (prevText === 'Generating..') return 'Generating...'
                })
            }
        }, 200)
        return () => clearInterval(interval)
    }, [isGenerating])

    const handleSingleViolationFix = async (index: number, violationDescription: string) => {
        setIsGenerating(true)
        const response = await fetch(`${BASE_URL}/solutions/${index}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ description: violationDescription })
        })

        const data = await response.json()
        const parsedData = JSON.parse(data.message)
        setFix(parsedData.violation)
        setIsGenerating(false)
    }

    //save the fix to local storage and access it in the popup when its opened
    useEffect(() => {
        chrome.tabs.query({active: true, currentWindow: true}, tabs => {
            const tabId = tabs[0].id;
            chrome.storage.local.get( [`fix-${tabId}-${index}`], function(result) {
                setFix(result[`fix-${tabId}-${index}`])
            })
        })
    }, [])
    
    useEffect(() => {
        // create a local storage variable for the fix when the data is fetched
        chrome.tabs.query({active: true, currentWindow: true}, tabs => {
            const tabId = tabs[0].id;
            console.log(`fix-${tabId}-${index}: `, fix)
            chrome.storage.local.set({ [`fix-${tabId}-${index}`]: fix })
        })
        // save the chat log to local storage and access it in the popup when its opened and a fix exists
        chrome.tabs.query({active: true, currentWindow: true}, tabs => {
            const tabId = tabs[0].id;
            const storageKey = `chatLog_${tabId}-${index}`
            chrome.storage.local.get([storageKey], function(result) {
                if (result[storageKey] !== undefined) {
                    setChat(result[storageKey]);
                } else {
                    console.log(`${storageKey} not found in local storage`);
                }
            });
        })
    }, [fix])

    const updateChatLog = async (url: string | URL | Request, message: string, agent: string) => {
        setIsLoading(true)
        const newChatLog = [...chat, { message, agent}]
        setChat(newChatLog)
        chrome.tabs.query({active: true, currentWindow: true}, tabs => {
            const tabId = tabs[0].id;
            chrome.storage.local.set({ [`chatLog_${tabId}-${index}`]: newChatLog })
        })
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat: newChatLog
            })
        })
        const data = await response.json()
        
        const updatedChatLog = [...newChatLog, { message: data.message, agent: 'agent' }]
        setChat(updatedChatLog)
        chrome.tabs.query({active: true, currentWindow: true}, tabs => {
            const tabId = tabs[0].id;
            chrome.storage.local.set({ [`chatLog_${tabId}-${index}`]: updatedChatLog })
        })
        setIsLoading(false)
    }

    const handleClearFix = () => {
        setFix(null)
        setChat([])
        chrome.tabs.query({active: true, currentWindow: true}, tabs => {
            const tabId = tabs[0].id;
            chrome.storage.local.remove([`fix-${tabId}-${index}`])
        })
        chrome.tabs.query({active: true, currentWindow: true}, tabs => {
            const tabId = tabs[0].id;
            chrome.storage.local.remove([`chatLog_${tabId}-${index}`])
        })
    }

    const handleClearChatLog = () => {
        setChat([])
        chrome.tabs.query({active: true, currentWindow: true}, tabs => {
            const tabId = tabs[0].id;
            chrome.storage.local.set({ [`chatLog_${tabId}-${index}`]: [] });
        })
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
        <>
        <li className='flex justify-between rounded-md px-2 shadow-md border-gray-600 bg-slate-200 hover:bg-slate-100 py-2'>
            <div 
                className='flex items-start'
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <Button 
                    onClick={() => handleScrollToViolation(index)}
                    popup='Scroll to violation on the page'
                    className='font-bold px-2 py-0.5 rounded-md bg-blue-600 hover:bg-blue-400 text-white'
                >
                        {index+1}
                </Button>
                <div className='px-2'>
                    <p className='font-bold w-fit cursor-pointer'>{violation.description}</p>
                    <p>{violation.help}</p>
                    <a 
                        className='text-blue-400' 
                        href={violation.helpUrl}
                        target='_blank'
                        rel='noopener noreferrer'
                    >
                        {violation.helpUrl}
                    </a>
                    <p className='space-x-1'>
                        {violation.tags.map((tag, index) => <span key={index} className='px-1 py-0.5 bg-gray-800 text-white rounded-md'>{tag}</span>)}
                    </p>
                </div>
            </div>
            <div className='flex flex-col justify-center items-end max-w-20 min-w-20 space-y-2'>
                <h1 className={`${getImpactColour(violation.impact)} px-2 py-0.5 rounded-md`}>
                    {violation.impact}
                </h1>
                <Button
                    className='font-bold px-2 py-0.5 rounded-md bg-blue-600 hover:bg-blue-400 text-white'
                    onClick={() => setDropdownVisible(!dropdownVisible)}
                    popup='List all issues that contribute to this violation'
                >
                        {violation.nodes.length === 1 ? `${violation.nodes.length} - Issue` : `${violation.nodes.length} - Issues`}
                </Button>
                <Button
                    className='font-bold px-2 py-0.5 rounded-md bg-green-600 hover:bg-green-400 text-white'
                    onClick={() => handleSingleViolationFix(index, violation.description)}
                    popup='generates a potential solution for this violation'
                >
                    Resolve
                </Button>
            </div>
        </li>
        {isGenerating && <div className='flex p-2 font-mono text-xl'>
            {generatingText}
        </div>}
        {fix && !isGenerating &&
        <div className='flex flex-col justify-center items-start p-2 mx-2 rounded-md shadow-md border-gray-600 bg-slate-200 hover:bg-slate-100 space-y-1'>
            <div className='flex justify-around space-x-2'>
                <div className='font-medium'>
                    {fix[0].solution}
                </div>
                <Button
                    className='font-bold px-2 py-0.5 rounded-md bg-red-600 hover:bg-red-400 text-white'
                    onClick={() => handleClearFix()}
                >
                    x
                </Button>
            </div>
            <div className='font-mono'>
                {fix[0].example}
            </div>
            <div className='flex justify-between w-full h-20'>
                <form onSubmit={handleSubmit}>
                    <input
                        ref={inputRef}
                        className='
                            p-2
                            rounded-md 
                            border-2 
                            border-gray-300 
                            focus:outline-none 
                            focus:border-blue-500
                            disabled:bg-white
                            font-size-sm
                        '
                        placeholder={loading ? `Fetching response...` : `For more information...`}
                        value={input} 
                        onChange={(e) => setInput(e.target.value)} 
                        disabled={isGenerating}
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
            <ul>
                {chat.map((item, index) => (
                    <div key={index} className={`flex flex-col ${item.agent === 'user' ? 'items-start' : 'items-end'} `}>
                        <div className='w-1/2'>
                            {item.agent !== 'user' && <div className='text-md font-bold font-mono'>Assistant</div>}
                            <div className={`w-fit ${item.agent === 'user' ? 'bg-blue-100' : 'bg-gray-100'} p-2 rounded-2xl border border-gray-300 font-mono`}>{item.message}</div>
                        </div>
                    </div>
                ))}
            </ul>
        </div>}
        <div className={`transition-max-height duration-500 ease-in-out overflow-hidden ${dropdownVisible ? 'max-h-96' : 'max-h-0'}`}>
            {violation.nodes.map((node, index) => (
                <div key={index} className='flex justify-start align-middle p-2 m-2 space-x-2'>
                    <Button 
                        className='font-bold px-2 py-0.5 rounded-md bg-blue-600 hover:bg-blue-400 text-white'
                        >
                            {index+1}
                    </Button>
                    <div className='p-1 shadow-md border-gray-600 bg-gray-200 rounded-md'>{node}</div>
                </div>
            ))}
        </div>
        </>
    )
}

export default Card;