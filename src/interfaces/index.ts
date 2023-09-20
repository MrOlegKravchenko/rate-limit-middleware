export interface IRequest {
    requestId: string,
    receiveTime: number
}

export interface IUser {
    userId: string,
    requestsStack: IRequest[],
    pushNewRequest: (r: IRequest) => void,
    isLimitExceeded: () => boolean,
    onHold?: () => boolean
}

export interface IUsers {
    userIds: string[],
    userInfos: {
        [user: string]: IUser
    }
}
