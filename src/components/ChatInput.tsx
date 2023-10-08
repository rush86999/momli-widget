/* eslint-disable react/self-closing-comp */
import { VNode, h } from "preact";
import { useState } from "preact/compat";
import cls from 'classnames'



type Props = {
    sendMessage: (text: string) => void,
    isNewSession: boolean,
    isChat: boolean
}

 const ChatInput = ({ sendMessage, isNewSession, isChat }: Props): VNode => {
    const [text, setText] = useState<string>('')

    const onChangeText = (e: h.JSX.TargetedEvent<HTMLTextAreaElement>) => (setText(e.currentTarget.value))

    const onSubmit = (e) => {
        e.preventDefault()
        // validate
        if (!text) {
            return
        }
        sendMessage(text)
        setText('')
    }

    

    return (
        <div className={cls("w-full", { hidden: !isChat })}>
            <form onSubmit={(e) => { e.preventDefault()}} className={cls({ 'opacity-50': isNewSession, hidden: !isChat })}>
                <label for="chat" className={cls("sr-only", { hidden: !isChat })}>Your message</label>
                <div className=" rounded-b-lg bg-primary">
                    <div className={cls("flex items-center px-3 py-2 bg-primary", { hidden: !isChat })}>
                        <textarea 
                            id="chat2" 
                            rows={1} 
                            className={cls("block mx-4 p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-secondary focus:border-secondary dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-secondary dark:focus:border-secondary", { hidden: !isChat })} 
                            placeholder="Your message..."
                            value={text}
                            onChange={onChangeText}
                        />
                        <button disabled={isNewSession} onClick={onSubmit} type="submit" className={cls("inline-flex justify-center p-2 text-secondary rounded-full cursor-pointer hover:bg-blue-100 dark:text-secondary dark:hover:bg-gray-600", { hidden: !isChat })}>
                            <svg aria-hidden="true" className="w-6 h-6 rotate-90" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path></svg>
                            <span className={cls("sr-only", { hidden: !isChat })}>Send message</span>
                        </button>
                    </div>
                    <h4 className="text-l py-1 text-white text-center">Powered by <a className="hover:underline hover:text-xl hover:font-bold" href="https://sitebot.atomiclife.app">SiteBot</a></h4>
                </div>
            </form>
        </div>
    )

}

export default ChatInput
