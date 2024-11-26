import React from "react"

type CustomButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
    children?: React.ReactNode
    className?: string
}

export const Button = ({ onClick, children, className, ...props }: CustomButtonProps) => {
    return (
        <button
            {...props}
            onClick={onClick} 
            className={`
                p-2 
                rounded-md 
                border-2 
                bg-white 
                border-gray-300 
                focus:outline-none 
                focus:border-blue-500 
                disabled:bg-gray-200
                ${className} `}>
                {children}
        </button>
    )
}