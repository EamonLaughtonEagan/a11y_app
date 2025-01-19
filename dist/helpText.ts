const generateHelpText = () => {
    const helpText = {}
    const values = [
        'Hover over a button for additional information',
        'Clicking on the index number of a violation from the list will scroll the page to that violation',
        'Clicking on the issue index button will show each instance relating to a specific violation present on the page',
        'Generate - generate violations on the current page',
        'Clear - clear violations on the current page',
        'Suggestions - generates AI suggestions given the violations present on the page',
        'Send - sends a message to the AI assistant',
        'Input - if you would like to chat with the AI assistant, or get additional clarity on a violation, type your message here and press enter',
        'Reset - clears the chat log and AI memory'
    ]
    
    const keys = values.map((_, index) => `keys${index}`)
    keys.forEach((key, index) => {
        helpText[key] = values[index]
    })

    return helpText
}

const helpText = generateHelpText();

export default helpText;