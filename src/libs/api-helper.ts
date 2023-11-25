import axios from 'redaxios'
import { StateUpdater } from "preact/hooks"
import { ChatHistoryType, MessageHistoryType, UserChatType } from "./types"
import { cxBotWSDevUrl, defaultIntroMessage, getIntroMessageUrl } from "./constants"
import dayjs from './date-utils'
import { ChatMessageBodyType } from './types/ChatMessageBodyType'
import { v4 as uuid } from 'uuid'
import _ from 'lodash'


export const createChatSocket = async () => {
    try {
        const socket = new WebSocket(cxBotWSDevUrl)
        return socket
    } catch (e) {
        console.log(e, ' unable to create client')
    }
}

export const addNewQuery = async (
    user_query: string,
    userId: string,
    agentId: string,
) => {
    try {

    } catch (e) {
        console.log(e, ' unable to add new query')
    }
}

export const sendMessageToServer = async (
    socket: WebSocket,
    chatMessageBody: ChatMessageBodyType,
    userMessage: string,
    chatHistory: ChatHistoryType,
    setChatHistory: StateUpdater<ChatHistoryType | []>,
) => {
    console.log(chatHistory, ' chatHistory inside addNewQuestion')
    const newChatHistory = (chatHistory || [])?.concat([{
        role: 'user',
        content: userMessage,
        id: chatHistory?.length, // old length so matche index
        date: dayjs().format(),
        name: chatMessageBody?.clientName,
    }])

    setChatHistory(newChatHistory)

    try {
        chatMessageBody.question = userMessage

        await sendMessage(socket, chatMessageBody)
    } catch (e) {
        console.log(e, ' unable to send message to server')
    }
}

export const sendMessage = async (
    socket: WebSocket,
    body: ChatMessageBodyType,
) => {
    try {
        socket.send(JSON.stringify(body))
    } catch (e) {
        console.log(e, ' unable to send message')
    }
}

export const receiveMessageFromServer = async (
    chatMessageBody: ChatMessageBodyType,
    chatHistory: ChatHistoryType,
    setChatHistory: StateUpdater<ChatHistoryType | []>,
) => {
    try {
        
        const serverMessagedHistory = chatMessageBody?.messageHistory
        const length = serverMessagedHistory?.length
        const lastMessage = serverMessagedHistory?.[length - 1 === -1 ? 0 : length - 1]
        
        const clonedChatHistory = _.clone(chatHistory)
        
        if (lastMessage?.role === 'assistant') {
            const newChatMessage: UserChatType = {
                id: clonedChatHistory?.length,
                date: dayjs().format(),
                ...lastMessage,
            }

            const cloneLength = clonedChatHistory?.length
            if (clonedChatHistory[cloneLength - 1 === -1 ? 0 : cloneLength - 1]?.role === 'assistant') {

                clonedChatHistory[cloneLength - 1 === -1 ? 0 : cloneLength - 1].content += lastMessage?.content

                if (!clonedChatHistory[cloneLength - 1 === -1 ? 0 : cloneLength - 1]?.name) {
                    if (chatMessageBody?.agentName) {
                        clonedChatHistory[cloneLength - 1 === -1 ? 0 : cloneLength - 1].name = chatMessageBody?.agentName
                    }
                }
            } else {
                clonedChatHistory[cloneLength] = newChatMessage

                if (!clonedChatHistory[cloneLength]?.name) {
                    if (chatMessageBody?.agentName) {
                        clonedChatHistory[cloneLength].name = chatMessageBody?.agentName
                    }
                }
            }
            
        }

        setChatHistory(clonedChatHistory)
    } catch (e) {
        console.log(e, ' unable to receive message from server')
    }
}

export const newSession = async (
    baseUrl: string,
    setChatMessageBody: StateUpdater<ChatMessageBodyType | undefined>,
    setChatHistory: StateUpdater<ChatHistoryType>,
) => {

    if (baseUrl) {
        const response = await axios.post(getIntroMessageUrl, 
            {
                baseUrl,
            }, {
            headers: {
            'Content-Type': 'application/json'
            },
        })

        if (response?.data?.event) {
            const introMessage = response?.data?.event
            setChatHistory([{
                role: 'assistant',
                content: introMessage,
                id: 0,
                date: dayjs().format(),
            }])

            const messageHistory: MessageHistoryType = [{
                role: 'assistant',
                content: introMessage,
            }]
            const newChatMessageBody: ChatMessageBodyType = {
                messageHistory,
                question: '',
                base_url: baseUrl,
                id: uuid()
            }

            setChatMessageBody(newChatMessageBody)
        } else {
            setChatHistory([{
                role: 'assistant',
                content: defaultIntroMessage,
                id: 0,
                date: dayjs().format(),
            }])

            const messageHistory: MessageHistoryType = [{
                role: 'assistant',
                content: defaultIntroMessage,
            }]
            const newChatMessageBody: ChatMessageBodyType = {
                messageHistory,
                question: '',
                base_url: baseUrl,
                id: uuid()
            }

            setChatMessageBody(newChatMessageBody)
        }
    } else {
        setChatHistory([{
            role: 'assistant',
            content: defaultIntroMessage,
            id: 0,
            date: dayjs().format(),
        }])

        const messageHistory: MessageHistoryType = [{
            role: 'assistant',
            content: defaultIntroMessage,
        }]
        const newChatMessageBody: ChatMessageBodyType = {
            messageHistory,
            question: '',
            base_url: baseUrl,
            id: uuid()
        }

        setChatMessageBody(newChatMessageBody)
    }
}
