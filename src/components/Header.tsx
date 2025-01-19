import React, { useState } from "react";
import { Button } from "./Buttons";
import helpTextArray from "../util/helpText";


const Header = () => {
    const [helpDropdownVisible, setHelpDropdownVisible] = useState(false);
    
    return (
        <header className='flex flex-col pt-4'>
            <div className='flex justify-between px-4'>
                <h1 className='text-2xl font-bold text-center font-mono p-2 bg-amber-500 rounded-lg border-2'>
                    Accessibility Assistant
                </h1>
                <Button 
                    onClick={() => setHelpDropdownVisible(!helpDropdownVisible)}
                    className='hover:bg-gray-300 bg-white'>
                    Help
                </Button>
            </div>
            <div className='flex justify-start px-4'>
                {helpDropdownVisible && 
                    <div className='font-mono'>
                        {helpTextArray.map((text, index) => (
                            <p key={index} className='p-1'>{index+1}: {text}</p>
                        ))}
                    </div>
                }
            </div>
        </header>
    );
}

export default Header