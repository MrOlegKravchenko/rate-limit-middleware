import crypto from 'crypto';
import { IRequest, IUsers } from '../../interfaces';
import { maxRequests, interval, haltTime } from '../../constants';
import { User } from '../../constructors/User';

const users: IUsers = {};

const rateLimitMiddleware = (req, res, next) => {
    // To determine user I generate postman requests with 'user-id' values in headers
    const userId = req.headers['user-id'] as string;

    let uuid = crypto.randomUUID();
    const newRequest: IRequest = { requestId: uuid, receiveTime: new Date().getTime() };

    if( users[userId]?.onHold ) {
        return res
            .status(429)
            .send(`User - ${userId} - exceeded maximum requests per user, which is ${maxRequests} per ${interval}, this blocking will last ${haltTime} seconds.`);
    }

    if( !(userId in users) ) {
        users[userId] = new User(userId, []);
    }

    users[userId].pushNewRequest(newRequest);
    next()
};

export default rateLimitMiddleware;
