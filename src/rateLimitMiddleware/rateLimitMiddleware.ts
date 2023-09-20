interface IRequest {
    requestId: string,
    receiveTime: number
}
interface IUser {
    userId: string,
    requestsStack: IRequest[],
    pushNewRequest: (r: IRequest) => void,
    isLimitExceeded: () => boolean,
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

    isLimitExceeded(): boolean {
        // - wait until 100 (maxRequests) request;
        if (this.requestsStack.length > this.maxRequests) {
            // - check the diff between last request's receive time and request's receive time 100 before;
            const nRequestTimeFromEnd = (n: number): number => this.requestsStack[this.requestsStack.length - 1 - n].receiveTime;
            const delta: number = nRequestTimeFromEnd(0) - nRequestTimeFromEnd(this.maxRequests);

            // console.log(`nRequestTimeFromEnd`, nRequestTimeFromEnd(0), nRequestTimeFromEnd(this.maxRequests));
            // console.log(`delta for ${this.userId}`, delta/1000, (delta/1000) <= this.interval);
            return delta/1000 <= this.interval; // IF delta is less than interval, so it means that requests are too frequent
        }
        return false;
    }
    pushNewRequest(userRequest: IRequest): void {
        this.requestsStack.push(userRequest);
    }
    onHold(): boolean {
        let result: boolean = false;

        if ( this.isLimitExceeded() ) {
            result = true;
            // console.log('in onHold if', this.userId, result);

            setTimeout(() => {
                result = false;
                // console.log('in onHold setTimeout', this.userId, result);
            }, 5*1000)
        }
        // console.log('in onHold after if', this.userId, result);
        return result;
    }
}

const users: IUsers = {
    userIds: [],
    userInfos: {}
};


const rateLimitMiddleware = (req, res, next): void => {
    const maxRequests = 10;
    const interval = 6;
    const userId: string = req.headers['user-id'];
    const newRequest: IRequest = { requestId: String(new Date()), receiveTime: Number(new Date()) };

    if(users.userInfos[userId]?.onHold()) {
        res
            .status(429)
            .send(`User - ${userId} - exceeded maximum requests per user, which is ${maxRequests} per ${interval}, this blocking will last 1 minute.`);
    } else if( users.userIds.includes(userId)) {
        // console.log('includes userId ', userId);
        users.userInfos[userId].pushNewRequest(newRequest);
    } else {
        users.userIds.push(userId);
        users.userInfos[userId] = new User(userId, [newRequest], maxRequests, interval);
    }
    // console.log('rateLimitMiddleware', userId, Object.values(users.userInfos).map((user: IUser) => user.requestsStack.length));
    next()
};

export default rateLimitMiddleware;
