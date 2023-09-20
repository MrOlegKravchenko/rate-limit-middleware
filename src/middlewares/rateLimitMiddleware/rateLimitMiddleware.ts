import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { IRequest, IUsers } from '../../interfaces';
import { maxRequests, interval } from '../../constants';
import { User } from '../../constructors/User';

const users: IUsers = { // simplify
    userInfos: {}
};

const rateLimitMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // To determine user I generate postman requests with 'user-id' values in headers
    const userId = req.headers['user-id'] as string;

    let uuid = crypto.randomUUID();
    const newRequest: IRequest = { requestId: uuid, receiveTime: new Date().getTime() };

    if( users.userInfos[userId]?.onHold ) {
        return res
            .status(429)
            .send(`User - ${userId} - exceeded maximum requests per user, which is ${maxRequests} per ${interval}, this blocking will last 1 minute.`);
    }

    if( !(userId in users.userInfos) ) { // in users
        users.userInfos[userId] = new User(userId, []);
    }

    // if( !users.userInfos[userId].pushNewRequest(newRequest) ) {
    //     return res
    //         .status(429)
    //         .send(`User - ${userId} - exceeded maximum requests per user, which is ${maxRequests} per ${interval}, this blocking will last 1 minute.`);
    // }
    users.userInfos[userId].pushNewRequest(newRequest);
    next()
};

export default rateLimitMiddleware;
