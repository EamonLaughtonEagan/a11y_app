import React, { useState } from 'react';
import '../assets/tailwind.css'
import { Button } from './Buttons';

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
    const [dropdownVisible, setDropdownVisible] = useState(false);
    console.log('Vilation Nodes:', violation.nodes.map(node => node));
    console.log('violationFromCard:', violation);

    const handleMouseEnter = () => {
        chrome.runtime.sendMessage({ message: 'hoverCard', action: 'enter', index: index})
    }

    const handleMouseLeave = () => {
        chrome.runtime.sendMessage({ message: 'hoverCard', action: 'leave', index: index})
    }


    return (
        <>
        <li className='flex justify-between border rounded-md px-2 shadow-md border-gray-600 py-2'>
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
            </div>
        </li>
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