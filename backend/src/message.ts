export const MessageError = {
    DEFAULT: (message: MessageName) => [`${message}`],
    NOT_FOUND: (content: MessageName) => [`${content}_not_found`],
    EXISTS: (content: MessageName) => [`${content}_already_exists`],
    EXPIRED: (content: MessageName) => [`${content}_expired`],
    INCORRECT: (content: MessageName) => [`${content}_is_incorrect`],
    ACCESS_DENIED: () => [`access_denied`]
}

export enum MessageName {
    USER = 'user',
    TOKEN = 'token',
    MERKLE_TREE = 'merkle_tree'
}