import { h, VNode } from 'preact';

import { useEffect, useState } from 'preact/compat'
import { StateUpdater } from 'preact/hooks';
import { useZorm } from 'react-zorm';
import axios from 'redaxios'
import { z } from 'zod';
import { registerClient, retryCodeForClient, verifyCodeForClient } from '../libs/client/api-helper';
import { ResponseClientBodyType } from '../libs/types/ResponseClientBody';
// @ts-ignore
import { startWindToast } from "@mariojgt/wind-notify/packages/index.js"
import { chatStateEnum } from '../libs/constants';

interface Props {
    baseUrl: string,
    clientId: string,
    name: string,
    email: string,
    setBotId: StateUpdater<string>,
    setUserId: StateUpdater<string>,
    setClientId: StateUpdater<string>,
    setBotKnowledgebaseId: StateUpdater<string>,
    setRoomId: StateUpdater<string>,
    setThreadId: StateUpdater<string>,
    setTeamId: StateUpdater<string>,
    setName: StateUpdater<string>,
    setEmail: StateUpdater<string>,
    setClientVerified: StateUpdater<boolean>,
    setChatState: StateUpdater<chatStateEnum>,
}

const FormSignUpSchema = z.object({
    name: z.string().min(1, 'too short'),
    email: z.string().email({ message: 'Invalid email address'})
})

const FormCodeSchema = z.object({
    code: z.string().refine(
        (code) => typeof parseInt(code, 10) === 'number', 'Only digits are allowed'
    )
    .refine((code) => code.length > 3, 'Minimum of 4 digits of code')
    .refine((code) => code.length < 5, 'Maximum of 4 digits of code')
})

function ErrorMessage(props: { message: string }) {
    return (
        <label className="label">
            <span className="label-text-alt text-red-600">{props?.message}</span>
            <span />
        </label>
        
    )
}


export default function RegisterClient(props: Props) {
    const [isCode, setIsCode] = useState<boolean>(false)
    const [clientId, setClientId] = useState<string>(props?.clientId ?? '')

    const zoSignUp = useZorm("signup", FormSignUpSchema, {
        async onValidSubmit(e) {
            e.preventDefault();
            const name = e.data.name
            const email = e.data.email
            props.setName(name)
            props.setEmail(email)
            // alert("Form ok!\n" + JSON.stringify(e.data, null, 2));
            const res = await registerClient(props?.baseUrl, email, name)
            if (res) {
                props.setBotId(res?.botId)
                props.setUserId(res?.userId)
                props.setClientId(res?.clientId)
                setClientId(res?.clientId)
                props.setBotKnowledgebaseId(res?.botKnowledgebaseId)
                props.setRoomId(res?.roomId)
                props.setThreadId(res?.threadId)
                props.setTeamId(res?.teamId)
                props.setClientVerified(res?.clientVerified ?? false)

                if (res?.clientVerified) {
                    props.setClientVerified(res?.clientVerified)
                    props.setChatState(chatStateEnum.CHAT)
                    
                } else {
                    setIsCode(true)
                }
            }
        },
    })

    const zoCode = useZorm("code", FormCodeSchema, {
        async onValidSubmit(e) {
            e.preventDefault()
            const code = e.data.code

            const codeVerified = await verifyCodeForClient(props?.clientId ?? clientId, code)

            if (codeVerified) {
                const res = await registerClient(props?.baseUrl, props?.email, props?.name)
                props.setClientVerified(res?.clientVerified ?? false)
                props.setChatState(chatStateEnum.CHAT)

            } else {
                setIsCode(true)
                startWindToast('Invalid Code', 'Code is not valid, please try again', 'error', 10, 'bottom')
            }
        },
    })

    useEffect(() => {
        (async () => {
            try {
                if (props?.name && props?.email) {
                    const res = await registerClient(props?.baseUrl, props?.email, props?.name)
                    if (res) {
                        props.setBotId(res?.botId)
                        props.setUserId(res?.userId)
                        props.setClientId(res?.clientId)
                        setClientId(res?.clientId)
                        props.setBotKnowledgebaseId(res?.botKnowledgebaseId)
                        props.setRoomId(res?.roomId)
                        props.setThreadId(res?.threadId)
                        props.setTeamId(res?.teamId)
                        props.setClientVerified(res?.clientVerified ?? false)

                        if (res?.clientVerified) {
                            props.setChatState(chatStateEnum.CHAT)
                        } else {
                            setIsCode(true)
                        }
                    }
                }
            } catch (e) {
                console.log(e, ' unable to register client')
            }
        })()
    }, [])
    const retryCodeAgain = async () => {
        try {
            await retryCodeForClient(props?.clientId ?? clientId)
            startWindToast('New Code Sent', 'A new code has been sent to your email', 'info', 10, 'bottom')
        } catch (e) {
            console.log(e, ' unable to retry code again')
        }
    }

    const disabledSignUp = zoSignUp.validation?.success === false

    const disabledCode = zoCode.validation?.success === false

    return (
        <div className="relative h-[375px] w-full max-w-[550px] sm:min-w-[400px] bg-primary-content flex flex-col justify-center items-center">
            <div>
                {isCode ?
                    (
                        <form ref = {zoCode.ref}>
                            <div className="form-control w-full max-w-xs">
                                <label className="label">
                                    <span className="label-text">Type the code we in your email?</span>
                                    <span />
                                </label>
                                <input type="text" placeholder="Type here" name={zoCode.fields.code()} className="input input-bordered w-full max-w-xs" />
                                {zoCode.errors.code((e) => (
                                    <ErrorMessage message={e.message} />
                                ))}
                            </div>
                            <button className="btn" disabled={disabledCode} type="submit">
                                Submit
                            </button>
                            <button className="btn" onClick={retryCodeAgain}>
                                Try a new code
                            </button>
                        </form>
                    ) : (
                        <form ref={zoSignUp.ref}>
                            <h2 className="card-title">
                                Sign In
                            </h2>
                            <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-300">Sign In to save & open your chat history</p>
                            <div className="form-control w-full max-w-xs">
                                <label className="label">
                                    <span className="label-text">What is your name?</span>
                                    <span />
                                </label>
                                <input type="text" placeholder="Type here" name={zoSignUp.fields.name()} className="input input-bordered w-full max-w-xs" />
                                {zoSignUp.errors.name((e) => (
                                    <ErrorMessage message={e.message} />
                                ))}
                                <label className="label">
                                    <span className="label-text">What is your email?</span>
                                    <span />
                                </label>
                                <input type="text" placeholder="Type here" name={zoSignUp.fields.email()} className="input input-bordered w-full max-w-xs" />
                                {zoSignUp.errors.email((e) => (
                                    <ErrorMessage message={e.message} />
                                ))}
                            </div>
                            <button className="btn" disabled={disabledSignUp} type="submit">
                                Submit
                            </button>
                        </form>
                    )}
            </div>
        </div>
    )

}