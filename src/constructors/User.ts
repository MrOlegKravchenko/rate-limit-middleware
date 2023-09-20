import { IRequest } from '../interfaces';


// User Constructor with build in methods to validate each User's data from inside.
export class User {
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
