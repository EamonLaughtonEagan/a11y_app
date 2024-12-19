import React from 'react';
import { createRoot } from 'react-dom/client';
import ContentScript from './contentScript';

function runAxe(tabId) {
    return new Promise((resolve, reject) => {
        //@ts-ignore
        axe.run((err, results) => {
            if (err) reject(err);
            else {
                const violationsWithNodes = results.violations.map((violation, index) => {
                    return {
                        ...violation,
                        nodes: violation.nodes.map(node => {
                            const element = document.querySelector(node.target);
                            element.id = `violation-${index}`;
                            const elementStyles = {
                                border: '2px solid purple',
                                borderRadius: '8px'
                            }
                            Object.assign(element.style, elementStyles);
                            element.classList.add('violation-style-element');

                            // create label
                            const label = document.createElement('div');
                            label.textContent = (index + 1).toString();
                            const labelStyles = {
                                position: 'absolute',
                                color: 'black',
                                border: '2px solid black',
                                borderRadius: '8px',
                                zIndex: '9999',
                                left: '0'
                            }
                            Object.assign(label.style, labelStyles);
                            label.classList.add('violation-style-label');
                            element.insertBefore(label, element.firstChild);

                            // create popup
                            const popup = document.createElement('div');
                            popup.textContent = violation.description;
                            const popupStyles = {
                                backgroundColor: 'white',
                                border: '1px solid black',
                                padding: '5px',
                                zIndex: '10000',
                                left: '0',
                                bottom: '100%', // Position above the label
                                marginBottom: '20px', // Add some space between label and popup
                                display: 'none'
                            }
                            Object.assign(popup.style, popupStyles);
                            popup.classList.add('violation-style-popup');

                            // Show popup on hover
                            element.addEventListener('mouseenter', () => {
                                popup.style.display = 'block';
                            });
                            element.addEventListener('mouseleave', () => {
                                popup.style.display = 'none'; 
                            });
                            // insert popup after the label
                            if (label.nextSibling) {
                                element.insertBefore(popup, label.nextSibling);
                            } else {
                                element.appendChild(popup);
                            }

                            return node.target;
                        })
                    }
                })
                chrome.storage.local.set({ [`violations_${tabId}`]:  violationsWithNodes });
                resolve(violationsWithNodes);
            } 
        });
    });
};

export default runAxe;