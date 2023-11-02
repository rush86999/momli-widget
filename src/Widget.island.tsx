import { h, VNode } from 'preact';

import './Widget.island.css';
import { useEffect, useState } from 'preact/compat';
import { ChatHistoryType, MessageHistoryType } from './libs/types';

import ScrollContainer from './components/ScrollContainer'
import ChatInput from './components/ChatInput'
import Message from './components/Message'
import cls from 'classnames'
import dayjs from './libs/date-utils';
import { createChatSocket, newSession, postData, receiveMessageFromServer, sendMessageToServer } from './libs/api-helper';
import { ChatMessageBodyType } from './libs/types/ChatMessageBodyType';
import { v4 as uuid } from 'uuid'
import { defaultIntroMessage, getIntroMessageUrl } from './libs/constants';
import axios from 'redaxios';

interface Props {
    baseUrl: string,
    theme: string
}

// floating-chat
// cross-icon

let socket: WebSocket | undefined

export default function App(props: Props): VNode {
    const [chatMessageBody, setChatMessageBody] = useState<ChatMessageBodyType>()
    const [tokenCount, setTokenCount] = useState<number>(0)
    const [isNewSession, setIsNewSession] = useState<boolean>(false)
    const [chatHistory, setChatHistory] = useState<ChatHistoryType | []>([{
        role: 'assistant',
        content: 'What can I answer today?',
        id: 0,
        date: dayjs().format(),
    }])
    const [isChat, setIsChat] = useState<boolean>(false)
    const [introMessage, setIntroMessage] = useState<string>('')

    const baseUrl = props?.baseUrl
    const theme = props?.theme

    useEffect(() => {
        (async () => {
            try {
                socket = await createChatSocket()
            } catch (e) {
                console.log(e, ' unable to connect')
            }
        })()
    }, [])


    // intro message if any
    useEffect(() => {
        (async () => {
            try {
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
                    }
                }
            } catch (e) {
                console.log(e, ' unable to get intro message')
            }
        })()
    }, [baseUrl])

    socket?.addEventListener("open", (event) => {
        console.log(event, 'connection established')

    })
    
    socket?.addEventListener("message", async (event) => {
        // SkillMessageHistoryType
        console.log(event,  ' message from api')
        console.log("Message from server ", event.data);
        /**
         * {"skill":"ask-availability","query":"completed","messages":[{"role":"user","content":"what is my availability like on Aug 7th?"},{"role":"assistant","content":"On August 7th, 2023, you have the following availability:\n- From 2:30 PM to 3:00 PM\n- From 5:00 PM to 11:00 PM."}],"required":null}
         */
        const body: ChatMessageBodyType = JSON.parse(event.data)
        
        setChatMessageBody(body)

        await onReceiveMessage(body)
    })

    const onReceiveMessage = async (body: ChatMessageBodyType) => {
        try {
            
            await receiveMessageFromServer(
                body,
                chatHistory,
                setChatHistory,
            )
        } catch (e) {
            console.log(e, ' unable to receive message')
        }
    }

    const callNewSession = async () => {
        await newSession(
            baseUrl,
            setChatMessageBody,
            setChatHistory,
        )

        setIsNewSession(false)
    }

    const toggleChat = () => {
        setIsChat(!isChat)
    }

    const onSendMessage = async (text: string) => {
        try {
            console.log(text, ' text inside onSendMessage')
            // sendMessageToServer
            let newChatMessageBody: ChatMessageBodyType | undefined = chatMessageBody

            if (!newChatMessageBody?.id) {
                const messageHistory: MessageHistoryType = [{
                    role: 'assistant',
                    content: defaultIntroMessage,
                }]
                newChatMessageBody = {
                    messageHistory,
                    question: text,
                    base_url: baseUrl,
                    id: uuid()
                }

                setChatMessageBody(newChatMessageBody)
            } else {
                newChatMessageBody.id = uuid()
                newChatMessageBody.question = text
                setChatMessageBody(newChatMessageBody)
            }

            if (socket) {
                await sendMessageToServer(socket, newChatMessageBody, text, chatHistory, setChatHistory)
            }
           
        } catch (e) {
            console.log(e, ' unable to send message')
        }
    }

    console.log(chatHistory, ' chatHistory')
    
    return (
        <div data-theme={theme} className="fixed bottom-20 right-20 flex flex-col justify-center items-end w-full z-10">
            <div className={cls('h-auto rounded-lg border border-primary my-2', { hidden: !isChat })}>
                <div
                    class="flex items-center justify-between rounded-t-lg bg-primary py-4 px-6 w-full"
                >
                    <h3 className="text-xl font-bold text-white">Let's chat?</h3>
                    <button onClick={toggleChat} className="text-white">
                        <svg width="15" height="15" viewBox="0 0 17 17" class="fill-current">
                            <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M0.474874 0.474874C1.10804 -0.158291 2.1346 -0.158291 2.76777 0.474874L16.5251 14.2322C17.1583 14.8654 17.1583 15.892 16.5251 16.5251C15.892 17.1583 14.8654 17.1583 14.2322 16.5251L0.474874 2.76777C-0.158291 2.1346 -0.158291 1.10804 0.474874 0.474874Z"
                            />
                            <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M0.474874 16.5251C-0.158291 15.892 -0.158291 14.8654 0.474874 14.2322L14.2322 0.474874C14.8654 -0.158292 15.892 -0.158291 16.5251 0.474874C17.1583 1.10804 17.1583 2.1346 16.5251 2.76777L2.76777 16.5251C2.1346 17.1583 1.10804 17.1583 0.474874 16.5251Z"
                            />
                        </svg>
                    </button>
                </div>
                <ScrollContainer scrollCta="New Message!" isNewSession={isNewSession} callNewSession={callNewSession}>
                    {
                        (chatHistory as ChatHistoryType)?.map((m, i) => (
                            <div key={m.id}>
                                <Message key={m.id} message={m} />
                            </div>
                        ))
                    }
                </ScrollContainer>
                <ChatInput isChat={isChat} sendMessage={onSendMessage} isNewSession={isNewSession} />
            </div>
            <button
                className="flex h-[70px] w-[70px] items-center justify-center rounded-full bg-primary text-white"
                onClick={toggleChat}
            >
                <span className={cls({ hidden: !isChat })}>
                    <svg
                        width="17"
                        height="17"
                        viewBox="0 0 17 17"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M0.474874 0.474874C1.10804 -0.158291 2.1346 -0.158291 2.76777 0.474874L16.5251 14.2322C17.1583 14.8654 17.1583 15.892 16.5251 16.5251C15.892 17.1583 14.8654 17.1583 14.2322 16.5251L0.474874 2.76777C-0.158291 2.1346 -0.158291 1.10804 0.474874 0.474874Z"
                        fill="white"
                        />
                        <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M0.474874 16.5251C-0.158291 15.892 -0.158291 14.8654 0.474874 14.2322L14.2322 0.474874C14.8654 -0.158292 15.892 -0.158291 16.5251 0.474874C17.1583 1.10804 17.1583 2.1346 16.5251 2.76777L2.76777 16.5251C2.1346 17.1583 1.10804 17.1583 0.474874 16.5251Z"
                        fill="white"
                        />
                    </svg>
                </span>
                <span className={cls({ hidden: isChat })}>
                    <svg
                        width="28"
                        height="28"
                        viewBox="0 0 28 28"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                        d="M19.8333 14.0002V3.50016C19.8333 3.19074 19.7103 2.894 19.4915 2.6752C19.2728 2.45641 18.976 2.3335 18.6666 2.3335H3.49992C3.1905 2.3335 2.89375 2.45641 2.67496 2.6752C2.45617 2.894 2.33325 3.19074 2.33325 3.50016V19.8335L6.99992 15.1668H18.6666C18.976 15.1668 19.2728 15.0439 19.4915 14.8251C19.7103 14.6063 19.8333 14.3096 19.8333 14.0002ZM24.4999 7.00016H22.1666V17.5002H6.99992V19.8335C6.99992 20.1429 7.12284 20.4397 7.34163 20.6585C7.56042 20.8772 7.85717 21.0002 8.16659 21.0002H20.9999L25.6666 25.6668V8.16683C25.6666 7.85741 25.5437 7.56066 25.3249 7.34187C25.1061 7.12308 24.8093 7.00016 24.4999 7.00016Z"
                        fill="white"
                        />
                    </svg>
                </span>
            </button>
        </div>
        
    );
}
