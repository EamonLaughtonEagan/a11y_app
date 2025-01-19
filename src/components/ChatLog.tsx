import React, {useEffect, useRef} from "react";
const ChatLog = ({ chatLog, loading }) => {

    const messagesEndRef = useRef(null);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [chatLog])

    return (
        <ul className={`space-y-4`}>
            {chatLog.map((chat: { agent: string; message: string; }, index: React.Key) => (
                <li 
                    key={index} 
                    className={`flex flex-col w-full h-min px-2`}
                >
                    <div className={`${chat.agent === 'user' ? 'items-end' : 'items-start'} flex flex-col`}> 
                        <div className='text-md px-2 font-mono font-bold'>{chat.agent === 'user' ? '' : 'Assistant'}</div>
                            <div 
                                className={`${chat.agent === 'user' ? 'bg-blue-100' : 'bg-gray-100'} w-fit p-2 rounded-2xl border border-gray-300 flex flex-col font-mono`}
                            >
                                <div>{chat.message}</div>
                        </div>
                    </div>
                        
                </li>
            ))}
            <div ref={messagesEndRef} />
        </ul>
    )
}

export default ChatLog;