export type chatLog = {
    index?: string,
    message: string,
    agent: string,
}

export type solution = {
    violation: string,
    solution: string,
    example?: string
}