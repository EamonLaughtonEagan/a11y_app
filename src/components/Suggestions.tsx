import React, { useEffect } from "react"

const Suggestions = ({ response, setResponse }) => {

  // save the suggestions to local storage
  useEffect(() => {
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
    const tabId = tabs[0].id;
    chrome.storage.local.set({ [`allResponses-${tabId}`]: response })
})
}, [response])

// gets the suggestions from local storage if they exist and the page is refreshed
useEffect(() => {
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
    const tabId = tabs[0].id;
    chrome.storage.local.get( [`allResponses-${tabId}`], function(result) {
        setResponse(result[`allResponses-${tabId}`])
    })
})
}, [])

  return (
    <ul className='flex flex-col p-2 space-x-1'>
    {response.map((item, index) => (
      <li key={index} className='bg-gray-100 rounded-md border-gray-300 border px-4 py-1 font-mono'>
        <div className='pb-1'>{item.violation}</div>
        <div>{item.solution}</div>
      </li>
    ))}
    </ul>
  )
}

export default Suggestions