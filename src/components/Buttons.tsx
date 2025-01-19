import React, { useEffect, useRef, useState } from "react"

type CustomButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
    children?: React.ReactNode
    className?: string
    popup?: string
}

export const Button = ({ onClick, children, className, popup, ...props }: CustomButtonProps) => {
    const popupRef = useRef<HTMLDivElement>(null)
    const timeoutRef = useRef(null);
    const [popupPosition, setPopupPosition] = useState<'top' | 'bottom'>('top')
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        const checkPopupPosition = () => {
            if (popupRef.current) {
                const rect = popupRef.current.getBoundingClientRect()
                if (rect.top < 0) {
                    setPopupPosition('bottom')
                } else {
                    setPopupPosition('top')
                }
            }
        }
        checkPopupPosition()
        window.addEventListener('resize', checkPopupPosition)
        return () => window.removeEventListener('resize', checkPopupPosition)
    }, [])

    const handleMouseEnter = () => {
        timeoutRef.current = setTimeout(() => {
            setShowPopup(true);
        }, 1000);
    };

    const handleMouseLeave = () => {
        clearTimeout(timeoutRef.current);
        setShowPopup(false);
    };

    const handleFocus = () => {
        setShowPopup(true);
    };

    const handleBlur = () => {
        setShowPopup(false);
    };

    return (
        <div 
            className='relative group' 
            onMouseEnter={handleMouseEnter} 
            onMouseLeave={handleMouseLeave}    
        >
            <button
                {...props}
                onClick={onClick}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className={`
                    p-2 
                    rounded-md 
                    border-2 
                    border-gray-300 
                    focus:outline-none 
                    focus:border-black
                    disabled:bg-gray-200
                    shadow-md
                    disabled:cursor-not-allowed
                    ${className} `}>
                    {children}
            </button>
            {(popup && showPopup) && <div 
                ref={popupRef}
                className={`absolute ${popupPosition === 'top' 
                ? 'bottom-full mb-2' 
                : 'top-full mt-2'} 
                hidden group-hover:block bg-black text-white text-xs rounded py-2 px-2`}>
                {popup}
            </div>}
        </div>
    )
}