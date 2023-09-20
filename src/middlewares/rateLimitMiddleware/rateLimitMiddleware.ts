import { Request, Response, NextFunction } from 'express';
import { IRequest, IUsers } from '../../interfaces';
import { User } from '../../constructors/User';

const users: IUsers = {
    userIds: [],
    userInfos: {}
};

const rateLimitMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const maxRequests = 10;
    const interval = 6;
    const userId: string = <string>req.headers['user-id'];
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
