import React, { useEffect, useRef, useState } from 'react'
import Modal from './Modal'

const ContentScript = () => {

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)

    const openModal = () => {
        if (timeoutId) {
            clearTimeout(timeoutId)
            setTimeoutId(null)
        }
        setIsModalOpen(true)
    }

    const closeModal = () => {
        const id = setTimeout(() => {
            setIsModalOpen(false)
        }, 1000)
        setTimeoutId(id)
    }

    const handleModalMouseEnter = () => {
        if (timeoutId) {
            clearTimeout(timeoutId)
            setTimeoutId(null)
        }
    }

    const handleModalMouseLeave = () => {
        closeModal()
    }

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <h1 style={{
                textAlign: 'center',
            }}>Hello from ContentScript!!!</h1>
        <button onMouseEnter={openModal} onMouseLeave={closeModal}>Open Modal</button>
        <Modal 
            isOpen={isModalOpen} 
            onClose={closeModal} 
            buttonRef={buttonRef}
            onMosueEnter={handleModalMouseEnter}
            onMouseLeave={handleModalMouseLeave}
        >
            <h1>Modal Content</h1>
            <p>This is the content of the modal</p>
        </Modal>
        </div>  
    )
}

export default ContentScript;