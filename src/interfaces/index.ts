export interface IRequest {
    requestId: string,
    receiveTime: number
}

export interface IUser {
    userId: string,
    requestsStack: IRequest[],
    pushNewRequest: (r: IRequest) => boolean,
    isLimitExceeded: () => boolean,
    onHold: boolean
}

export interface IUsers {
    [user: string]: IUser
}
