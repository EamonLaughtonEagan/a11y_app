import React, { useState } from "react";
import { Button } from "./Buttons";
import helpTextArray from "../util/helpText";


const Header = () => {
    const [helpDropdownVisible, setHelpDropdownVisible] = useState(false);
    
    return (
        <header className='flex flex-col bg-gray-300 p-2 space-y-2 shadow-lg rounded-lg border'>
            <div className='flex justify-between'>
                <h1 className='text-2xl font-bold text-center font-mono py-2 px-4 bg-blue-600 text-white rounded-lg border-2'>
                    Accessibility Assistant
                </h1>
                <Button 
                    onClick={() => setHelpDropdownVisible(!helpDropdownVisible)}
                    className='hover:bg-gray-400 hover:text-white bg-white'>
                    Help
                </Button>
            </div>
            {helpDropdownVisible && <div className='flex justify-start px-4 pt-2 bg-white rounded-lg border'>
                    <div className='font-mono'>
                        {helpTextArray.map((text, index) => (
                            <p key={index} className='py-1 pl-1'>{text}</p>
                        ))}
                    </div>
               
            </div>}
        </header>  
    )
}

export default Header