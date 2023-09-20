import { Request, Response, NextFunction } from 'express';
import { IRequest, IUsers } from '../../interfaces';
import { maxRequests, interval } from '../../constants';
import { User } from '../../constructors/User';

const users: IUsers = {
    userIds: [],
    userInfos: {}
};

const rateLimitMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const userId: string = <string>req.headers['user-id'];
    const newRequest: IRequest = { requestId: String(new Date()), receiveTime: Number(new Date()) };

    if(users.userInfos[userId]?.onHold()) {
        res
            .status(429)
            .send(`User - ${userId} - exceeded maximum requests per user, which is ${maxRequests} per ${interval}, this blocking will last 1 minute.`);
    } else if( users.userIds.includes(userId)) {
        users.userInfos[userId].pushNewRequest(newRequest);
    } else {
        users.userIds.push(userId);
        users.userInfos[userId] = new User(userId, [newRequest]);
    }
    next()
};

export default rateLimitMiddleware;
