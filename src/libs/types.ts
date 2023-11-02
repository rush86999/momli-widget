

export type SystemMessageType = {
    role: 'system',
    content: string // prompt
}

export type UserMessageType = {
    role: 'user',
    content: string // user input
}

export type AssistantMessageType = {
    role: 'assistant',
    content: string // gpt output
}

export type MessageHistoryType = (AssistantMessageType | UserMessageType | SystemMessageType)[]

export type AgentLanceDBRequestType = {
    new_query: string,
    userId: string,
    agentId: string,
    messageHistory: MessageHistoryType,
    totalTokenCount: number,
    userQueryObjectKey?: string,
    session_id?: string,
    base_url: string,
}

export type ChatResponseType = {
    totalTokenCount: number,
    messageList: MessageHistoryType,
    userQueryObjectKey?: string,
    session_id?: string,
}



export type UserChatType = {
    role: 'user' | 'assistant',
    content: string,
    id: number,
    date: string,
}


export type ChatHistoryType = UserChatType[]

