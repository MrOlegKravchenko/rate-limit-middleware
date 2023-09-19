const users = {
    ids: [],
    info: {}
};

const rateLimitMiddleware = ({ userId, maxRequests, interval }): void => {
    console.log('userId', userId, users);

    if( users.ids.includes(userId) ) {
        users.info[userId].count++;
        console.log('if', userId, users.info[userId]);
    } else {
        users.ids.push(userId);
        users.info[userId] = { count: 0 };
        console.log('else', userId, users.info[userId]);
    }

    // if(limit exceeded) {
    //     res
    //         .status(429)
    //         .send(`You've exceeded maximum requests per user, which is ${maxRequests} per ${interval}, this blocking will last 1 minute.`)
    // }
};

export default rateLimitMiddleware;
