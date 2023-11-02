import { VNode, h } from "preact";
import { UserChatType } from "../libs/types";
import dayjs from '../libs/date-utils'

type Props = {
    message: UserChatType,
}

function Message({ message }: Props): VNode {

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
                        <div>
                            <div className="chat-header">
                                Assistant
                            </div>
                            <div className="chat-bubble chat-bubble-secondary">{message.content}</div>
                            <div className="chat-footer opacity-50">
                                <time className="text-xs opacity-50">{dayjs(message.date).fromNow()}</time>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default Message


