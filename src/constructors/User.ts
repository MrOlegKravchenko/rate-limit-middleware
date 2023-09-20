import { IRequest } from '../interfaces';
import { maxRequests, interval, haltTime } from '../constants';


// User Constructor with build in methods to validate each User's data from inside.
export class User {
    userId: string;
    requestsStack: IRequest[];
    private _onHold = false;
    constructor(userId: string, requestsStack: IRequest[]) {
        this.userId = userId;
        this.requestsStack = requestsStack;
    }

    isLimitExceeded(): boolean {
        // Wait until 100 (maxRequests) request;
        if (this.requestsStack.length >= maxRequests) {
            // Checking the diff between last request's receive time and request's receive time 100 before;
            const getRequestTimeAt = (n: number): number => this.requestsStack.at(n).receiveTime;
            const delta: number = (getRequestTimeAt(-1) - getRequestTimeAt(-maxRequests)) / 1000;

            console.log(`>>> First ${maxRequests} request for ${this.userId} User takes ${delta} seconds.`,
                `Need ${interval} seconds.`,
                delta <= interval ? '<ON HOLD>' : '<GOOD>');

            // IF delta is less than interval, so it means that requests are too frequent
            return delta <= interval;
        }
        return false;
    }
    pushNewRequest(userRequest: IRequest): boolean {
        this.requestsStack.push(userRequest);
        // Cleaning, leaving only last 100 (maxRequests) requests;
        if (this.requestsStack.length > maxRequests) {
            this.requestsStack = this.requestsStack.splice(-maxRequests);
        }
        if (this.isLimitExceeded()) {
            this.onHold = true;

            setTimeout(() => {
                this.onHold = false;
            }, haltTime * 1000)

            return false;
        }
        return true;
    }

    get onHold(): boolean {
        return this._onHold;
    }
    set onHold(value: boolean) {
        this._onHold = value;
    }
}
