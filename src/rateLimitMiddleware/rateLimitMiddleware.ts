interface IRequest {
    requestId: string,
    receiveTime: number
}
interface IUser {
    userId: string,
    requestsStack: IRequest[],
    pushNewRequest: (r: IRequest) => void,
    limitCheck: () => boolean,
    onHold?: () => boolean
}
interface IUsers {
    userIds: string[],
    userInfos: {
        [user: string]: IUser
    }
}

// User Constructor with build in methods to validate each User's data from inside.
class User {
    userId: string;
    requestsStack: IRequest[];
    maxRequests: number;
    interval: number;
    constructor(userId: string, requestsStack: IRequest[], maxRequests: number, interval: number) {
        this.userId = userId;
        this.requestsStack = requestsStack;
        this.maxRequests = maxRequests;
        this.interval = interval;
    }

    // - wait until 100 (maxRequests) request;
    // - check the diff between last request's receive time and request's receive time 100 before;
    limitCheck(): boolean {
        if (this.requestsStack.length >= this.maxRequests) {
            const lastRequestTimeByNFromEnd = (n: number): number => this.requestsStack[this.requestsStack.length - 1 - n].receiveTime;
            const delta: number = lastRequestTimeByNFromEnd(0) - lastRequestTimeByNFromEnd(this.maxRequests);

            return delta <= this.interval;
        }
        return false;
    }
    pushNewRequest(userRequest: IRequest): void {
        this.requestsStack.push(userRequest);
    }
    onHold(): boolean {
        return this.limitCheck();
    }
}

const users: IUsers = {
    userIds: [],
    userInfos: {}
};

const rateLimitMiddleware = ({ userId, maxRequests, interval }): void => {
    const newRequest: IRequest = { requestId: String(new Date()), receiveTime: Number(new Date()) };

    if( users.userIds.includes(userId) ) {
        users.userInfos[userId].pushNewRequest(newRequest);
        // console.log('if', userId, users.userInfos[userId]);
    } else {
        users.userIds.push(userId);
        users.userInfos[userId] = new User(userId, [newRequest], maxRequests, interval);
        // console.log('else', userId, users.userInfos[userId]);
    }
    console.log('rateLimitMiddleware', userId, users, maxRequests, interval);

    // if(limit exceeded) {
    //     res
    //         .status(429)
    //         .send(`You've exceeded maximum requests per user, which is ${maxRequests} per ${interval}, this blocking will last 1 minute.`)
    // }
};

export default rateLimitMiddleware;
