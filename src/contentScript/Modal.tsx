import React, { useEffect, useRef, useState } from 'react'

type ModalProps = {
    isOpen: boolean,
    onClose: () => void,
    children: React.ReactNode,
    buttonRef: React.RefObject<HTMLButtonElement>
    onMosueEnter: () => void,
    onMouseLeave: () => void,
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, buttonRef, onMosueEnter, onMouseLeave }: ModalProps) => {
    const [position, setPosition] = useState({ top: 0, left: 0 })
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect()
            setPosition({
                top: rect.top - 10, // adjust as needed
                left: rect.left + rect.width / 2,
            })
        }
    }, [isOpen, buttonRef])

    if (!isOpen) return null

    return (
        <div style={{ position: 'relative' }}>
            <div 
                style={{...styles.overlay, top: position.top, left: position.left}}
                onMouseEnter={onMosueEnter}
                onMouseLeave={onMouseLeave}
            >
                <div style={styles.modal}>
                    {children}
                </div>
            </div>
        </div>
    )
}

const styles = {
    overlay: {
        position: 'absolute' as 'absolute',
        transform: 'translate(-50%, -110%)',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    modal: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        position: 'relative' as 'relative',
        minWidth: '300px',
    },
    closeButton: {
        position: 'absolute' as 'absolute',
        top: '10px',
        right: '10px',
        background: 'none',
        border: 'none',
        fontSize: '16px',
        cursor: 'pointer',
    },
}

export default Modal;