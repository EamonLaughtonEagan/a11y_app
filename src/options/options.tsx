import React from 'react'
import { createRoot } from 'react-dom/client'
import '../assets/tailwind.css'

const test = (
    <div className='flex flex-col justify-start mx-2 bg-gray-100 w-full h-screen'>
        <h1 className='text-4xl'>Options Page</h1>
        <p className='text-2xl'>This page has yet to be implemented</p>
    </div>
)

const container = document.createElement('div')
document.body.appendChild(container)
const root = createRoot(container)
root.render(test)