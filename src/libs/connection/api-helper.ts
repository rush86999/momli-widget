import axios from 'redaxios'
import { getIntroMessageUrl } from '../constants'



export const getIntroMessage = async (
    baseUrl: string,
) => {
    try {
        const res = await axios.post(
            getIntroMessageUrl,
            {
                baseUrl,
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