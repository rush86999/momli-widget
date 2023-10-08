import { VNode, h } from "preact";
import { UserChatType } from "../lib/types";
import dayjs from '../lib/date-utils'

type Props = {
    message: UserChatType,
    isLoading?: boolean,
}

function Message({ message, isLoading }: Props): VNode {

    return (
        <div className="px-2">
            {
                message?.role === 'user'
                ? (
                    <div className="chat chat-end">
                        <div className="chat-header">
                            You
                        </div>
                        <div className="chat-bubble chat-bubble-primary">{message.content}</div>
                        <div className="chat-footer opacity-50">
                            <time className="text-xs opacity-50">{dayjs(message.date).fromNow()}</time>
                        </div>
                    </div>
                ) : (
                    <div className="chat chat-start">
                        {isLoading
                        ? (
                            <div>
                                <div className="chat-header">
                                    Assistant
                                </div>
                                <div className="chat-bubble chat-bubble-secondary flex items-center justify-center">
                                    <div className="ml-2" />
                                    <div className="dot-elastic" />
                                    <div className="mr-2" />
                                </div>
                                <div className="chat-footer opacity-50">
                                    <time className="text-xs opacity-50">{dayjs(message.date).fromNow()}</time>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div className="chat-header">
                                    Assistant
                                </div>
                                <div className="chat-bubble chat-bubble-secondary">{message.content}</div>
                                <div className="chat-footer opacity-50">
                                    <time className="text-xs opacity-50">{dayjs(message.date).fromNow()}</time>
                                </div>
                            </div>
                            )}
                    </div>
                )
            }
        </div>
    )
}

export default Message


