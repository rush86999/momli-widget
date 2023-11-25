

export const cxBotWSDevUrl = 'wss://dmq8q5dzsh.execute-api.us-east-1.amazonaws.com/dev'

export const getIntroMessageUrl = 'https://vddz12bmy3.execute-api.us-east-1.amazonaws.com/dev/get-intro-message'

export const defaultIntroMessage = 'What can I answer today?'

export enum chatStateEnum {
    CHAT = 'chat',
    SIGNIN = 'signIn',
    INITIAL = 'initial'
}