import React from 'react';
import '../assets/tailwind.css'

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
    console.log('violationFromCard:', violation.nodes.map(node => node));
    console.log('violationFromCard:', violation);
    return (
        <li className='flex justify-between border-b border-gray-600 py-2'>
            <div className='flex items-start'>
                <h1>{index+1}</h1>
                <div className='px-2'>
                    <p className='font-bold w-fit cursor-pointer' onClick={() => handleScrollToViolation(index)}>{violation.description}</p>
                    <p>{violation.help}</p>
                    <a 
                        className='text-blue-400' 
                        href={violation.helpUrl}
                        target='_blank'
                        rel='noopener noreferrer'
                    >
                        {violation.helpUrl}
                    </a>
                </div>
            </div>
            <div>
                <h1 className={`${getImpactColour(violation.impact)} px-2 py-0.5 rounded-md`}>
                    {violation.impact}
                </h1>
                <p className='font-bold px-2 py-0.5 rounded-md bg-blue-600 text-white'>
                        {violation.nodes.length === 1 ? `${violation.nodes.length} - Issue` : `${violation.nodes.length} - Issues`}
                </p>
            </div>
        </li>
    )
}

export default Card;