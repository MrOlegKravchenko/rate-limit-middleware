import { expect } from 'chai';
import { User } from '../../src/constructors/User';
import { IRequest } from '../../src/interfaces';
import { maxRequests, interval } from '../../src/constants';

describe('User', () => {
  let user: User;
  const userId = 'testUserId';
  const request: IRequest = {
    requestId: 'testUser',
    receiveTime: 1695372119
  };

  beforeEach(() => {
    user = new User(userId, []);
  });
  afterEach(() => {

  })

  it('should initialize correctly', () => {
    expect(user.userId).to.equal(userId);
    expect(user.requestsStack).to.be.an('array').that.is.empty;
    expect(user.onHold).to.be.false;
  });

  it('should push a new request and clean the stack', () => {
    for (let i = 0; i < maxRequests; i++) {
      const result = user.pushNewRequest(
        { ...request, receiveTime: (request.receiveTime + 2*i)*1000 }
      );
      if (i < maxRequests) {
        expect(result).to.be.true;
      }
      expect(user.requestsStack.length).to.be.at.most(maxRequests);
    }
    const nextRequest = user.pushNewRequest(
      { ...request, receiveTime: 1695372129000 }
    )
    expect(nextRequest).to.be.false;
    expect(user.onHold).to.be.true;
  });

  it('should check if the limit is exceeded correctly', () => {
    for (let i = 0; i < maxRequests; i++) {
      user.pushNewRequest(
        { ...request, receiveTime: (request.receiveTime + i)*1000 }
      );
    }

    const result = user.isLimitExceeded();
    expect(result).to.be.true;

    setTimeout(() => {
      const resultAfterInterval = user.isLimitExceeded();
      expect(resultAfterInterval).to.be.false;
    }, interval * 1000);
  });

  it('should set onHold correctly', () => {
    user.onHold = true;
    expect(user.onHold).to.be.true;

    user.onHold = false;
    expect(user.onHold).to.be.false;
  });
});