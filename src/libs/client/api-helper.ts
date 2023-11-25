import axios from 'redaxios'
import { registerClientUrl, registerNonClientUrl, retryCodeUrl, signInClientUrl, verifyCodeUrl } from './constants';
import { ResponseClientBodyType } from '../types/ResponseClientBody';
import { ResponseNonClientBodyType } from '../types/ResponseNonClientBodyType';


export const registerNonClient = async (
    baseUrl: string,
    email?: string,
    name?: string,
) => {
    try {
        const res = await axios.post<{ message: string, event: ResponseNonClientBodyType }>(registerNonClientUrl,
            {
                baseUrl,
                email,
                name,
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                },
            })

        /**
         * chatClient,
            chatRoom,
            chatThread: chatThreadObject,
         */

        return res?.data?.event
    } catch (e) {
        console.log(e, ' unable to register client')
    }
}

export const registerClient = async (
    baseUrl: string,
    email: string,
    name?: string,
) => {
    try {
        const res = await axios.post <{ message: string, event: ResponseClientBodyType}>(registerClientUrl,
            {
                baseUrl,
                email,
                name,
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                },
            })

        /**
         * chatClient,
            chatRoom,
            chatThread: chatThreadObject,
         */

        return res?.data?.event
    } catch (e) {
        console.log(e, ' unable to register client')
    }
}

export const verifyCodeForClient = async (
    clientId: string,
    code: string,
) => {
    try {
        const res = await axios.post<{ message: string, event: boolean }>(
            verifyCodeUrl,
            {
                clientId,
                code,
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                },
            })

        return res?.data?.event
    } catch (e) {
        console.log(e, ' unable to register client')
    }
}

export const retryCodeForClient = async (
    clientId: string,
) => {
    try {
        const res = await axios.post(
            retryCodeUrl,
            {
                clientId,
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                },
            })

        return res?.data?.event
    } catch (e) {
        console.log(e, ' unable to register client')
    }
}

export const signInClient = async (
    baseUrl: string,
    email: string,
) => {
    try {
        const res = await axios.post(
            signInClientUrl,
            {
                baseUrl,
                email,
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                },
            })

        return res?.data?.event
    } catch (e) {
        console.log(e, ' unable to register client')
    }
}