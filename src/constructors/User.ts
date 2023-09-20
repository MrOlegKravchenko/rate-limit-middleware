import { IRequest } from '../interfaces';
import { maxRequests, interval, haltTime } from '../constants';


// User Constructor with build in methods to validate each User's data from inside.
export class User {
    userId: string;
    requestsStack: IRequest[];
    constructor(userId: string, requestsStack: IRequest[]) {
        this.userId = userId;
        this.requestsStack = requestsStack;
    }

    isLimitExceeded(): boolean {
        // Wait until 100 (maxRequests) request;
        if (this.requestsStack.length > maxRequests) {
            // Check the diff between last request's receive time and request's receive time 100 before;
            const nRequestTimeFromEnd = (n: number): number => this.requestsStack[this.requestsStack.length - 1 - n].receiveTime;
            const delta: number = nRequestTimeFromEnd(0) - nRequestTimeFromEnd(maxRequests);

            console.log(`>>> First ${maxRequests} request for ${this.userId} User takes ${delta/1000} seconds.`,
                `Need ${interval} seconds.`,
                (delta/1000) <= interval ? '<ON HOLD>' : '<GOOD>');
            return delta/1000 <= interval; // IF delta is less than interval, so it means that requests are too frequent
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

            setTimeout(() => {
                result = false;
            }, haltTime*1000)
        }
        return result;
    }
}
