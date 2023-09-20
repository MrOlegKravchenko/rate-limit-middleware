import crypto from 'crypto';
import { IRequest, IUsers } from '../../interfaces';
import { maxRequests, interval, haltTime } from '../../constants';
import { User } from '../../constructors/User';

const users: IUsers = {};

const rateLimitMiddleware = (req, res, next) => {
    // To determine user I generate postman requests with 'user-id' values in headers
    const userId = req.headers['user-id'] as string;

    const uuid = crypto.randomUUID();
    const newRequest: IRequest = { requestId: uuid, receiveTime: new Date().getTime() };

    try {
        if( users[userId]?.onHold ) {
            const message = `User - ${userId} - exceeded maximum requests per user,
                which is ${maxRequests} per ${interval}, this blocking will last ${haltTime} seconds.`
            throw new Error(message);
        }

        if( !(userId in users) ) {
            users[userId] = new User(userId, []);
        }

        users[userId].pushNewRequest(newRequest);
    } catch(error) {
        next(error)
        res
            .status(429)
            .send(`User - ${userId} - exceeded maximum requests per user, which is ${maxRequests} per ${interval}, this blocking will last ${haltTime} seconds.`);
    }

    next()
};

export default rateLimitMiddleware;
