
export type ChatGPTSystemMessageType = {
    role: 'system', // 'system'
    content: string // prompt
}

export type ChatGPTUserMessageType = {
    role: 'user', // 'user'
    content: string // user input
}

export type ChatGPTAssistantMessageType = {
    role: 'assistant', //'assistant',
    content: string // gpt output
}

export type ChatGPTMessageHistoryType = (ChatGPTAssistantMessageType | ChatGPTUserMessageType | ChatGPTSystemMessageType)[]


export type RouterType = 'pending' | 'bot_survey' | 'user_question' | 'bot_Net_Promoter_Score' | 'bot_request'

export type ChatMessageBodyType = {
    messageHistory: ChatGPTMessageHistoryType,
    data?: any,
    formData?: any,
    question: string,
    userId?: string,
    botId?: string,
    agentId?: string,
    botKnowledgebaseId?: string,
    base_url: string,
    session_id?: string,
    userQueryObjectFileKey?: string,
    userSurveyResponseFileKey?: string,
    userSurveyResponseKeywordsFileKey?: string,
    query?: 'incomplete' | 'completed',
    router?: RouterType,
    id: string,
    activeRole?: 'bot' | 'agent',
    roomId?: string,
    clientId?: string,
    threadId?: string,
    clientEmail?: string,
    isClient?: boolean,
    teamId?: string,
    agentConnectionId?: string,
    clientConnectionId?: string,
    clientName?: string,
    agentName?: string,
}