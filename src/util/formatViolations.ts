const formatViolations = (violations) => {
    return 'Here are the violations I found on the page... ' + violations.map((item, index) => `${index+1}: ${item.description}`).join(', ');
}

export default formatViolations;