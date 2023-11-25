

export type ResponseClientBodyType = {
    botId: string,
    userId: string,
    clientId: string,
    botKnowledgebaseId: string,
    roomId: string,
    threadId: string,
    teamId: string,
    sentCode?: boolean,
    clientVerified?: boolean,
}