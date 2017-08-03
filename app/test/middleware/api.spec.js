import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import ApiMiddleware, { CALL_API, Schemas } from '../../middleware/api';
import sinon from 'sinon';
import * as apiUtils from '../../utils/api';
import { Schema, arrayOf, normalize } from 'normalizr';

chai.use(chaiAsPromised);

const createFakeStore = fakeData => ({
  getState() {
    return fakeData;
  }
});

const dispatchWithStoreOf = (storeData, action) => {
  let dispatched = null;
  const dispatch = ApiMiddleware(createFakeStore(storeData))(actionAttempt => dispatched = actionAttempt );
  dispatch(action);
  return dispatched;
};

const dispatchWithStoreAndReturn = (storeData, action) => {
  const dispatch = ApiMiddleware(createFakeStore(storeData))((res) => res);
  return dispatch(action);
};

describe('api middleware', () => {
  let stub;

  beforeEach(() => {
    stub = sinon.stub(apiUtils, 'callApi');
  });

  afterEach(() => {
    stub.restore();
  });

  it('should dispatch to next dispatch if key: Symbol(\'Call API\') is not found', () => {
    const action = {
      type: 'What ever'
    };

    expect(
      dispatchWithStoreOf({}, action)
    ).to.equal(action);
  });

  it('should throw error if endpoint is not a string or function', () => {
    const action = {
      [CALL_API]: {

      }
    };

    try {
      dispatchWithStoreOf({}, action);
    } catch (e) {
      expect(e.message).to.equal('Specify a string endpoint URL.');
    }
  });

  it('should throw error if endpoint is a function and endpoint(state) didn\'t return string', () => {
    const action = {
      [CALL_API]: {
        endpoint(/* state */) {
          return 1;
        }
      }
    };

    try {
      dispatchWithStoreOf({}, action);
    } catch (e) {
      expect(e.message).to.equal('Specify a string endpoint URL.');
    }
  });

  it('should throw error if method is not a string', () => {
    const action = {
      [CALL_API]: {
        endpoint: '/system/info',
        method: 1
      }
    };

    try {
      dispatchWithStoreOf({}, action);
    } catch (e) {
      expect(e.message).to.equal('Specify a string method.');
    }
  });

  it('should throw error if types is not a array', () => {
    const action = {
      [CALL_API]: {
        endpoint: '/system/info',
        method: 'GET',
        types: 1
      }
    };

    try {
      dispatchWithStoreOf({}, action);
    } catch (e) {
      expect(e.message).to.equal('Expected an array of three action types.');
    }
  });

  it('should throw error if types is not a array with three elements', () => {
    const action = {
      [CALL_API]: {
        endpoint: '/system/info',
        method: 'GET',
        types: ['REQUEST', 'SUCCESS']
      }
    };

    try {
      dispatchWithStoreOf({}, action);
    } catch (e) {
      expect(e.message).to.equal('Expected an array of three action types.');
    }
  });

  it('should throw error if types is not a array with three string elements', () => {
    const action = {
      [CALL_API]: {
        endpoint: '/system/info',
        method: 'GET',
        types: ['REQUEST', 'SUCCESS', 1]
      }
    };

    try {
      dispatchWithStoreOf({}, action);
    } catch (e) {
      expect(e.message).to.equal('Expected action types to be strings.');
    }
  });

  it('should dispatch Reqeust action before call api', () => {
    const endpoint = '/system/info';
    const method = 'GET';
    const action = {
      [CALL_API]: {
        types: ['REQUEST', 'SUCCESS', 'FAILURE'],
        endpoint,
        method
      }
    };
    const res = {
      res: 'OK'
    };
    stub.withArgs({endpoint, schema: undefined, method, body: undefined, version: undefined }).returns(Promise.resolve(res));
    expect(
      dispatchWithStoreOf({}, action)
    ).to.deep.equal({
      type: 'REQUEST'
    });
  });

  it('should dispatch Success action when call api success', () => {
    const endpoint = '/system/info';
    const method = 'GET';
    const action = {
      [CALL_API]: {
        types: ['REQUEST', 'SUCCESS', 'FAILURE'],
        endpoint,
        method
      }
    };
    const response = {
      c: 1,
      d: 2
    };

    stub.withArgs({endpoint, schema: undefined, method, body: undefined, version: undefined }).returns(Promise.resolve(response));

    return expect(dispatchWithStoreAndReturn({}, action)).to.eventually.deep.equal({
      type: 'SUCCESS',
      response
    });
  });

  it('should dispatch Failure action when call api failure', () => {
    const endpoint = '/system/info';
    const method = 'GET';
    const schema = new Schema('users');
    const data = {
      a: 1,
      b: 2
    };
    const action = {
      [CALL_API]: {
        types: ['REQUEST', 'SUCCESS', 'FAILURE'],
        endpoint,
        method
      }
    };
    const error = new Error('Fake error.');

    stub.withArgs({endpoint, schema: undefined, method, body: undefined, version: undefined }).returns(Promise.reject(error));

    return expect(dispatchWithStoreAndReturn({}, action)).to.eventually.deep.equal({
      type: 'FAILURE',
      error,
    });
  });

  it('should dispatch Failure action when call api failure with no error', () => {
    const endpoint = '/system/info';
    const method = 'GET';
    const schema = new Schema('users');
    const data = {
      a: 1,
      b: 2
    };
    const action = {
      [CALL_API]: {
        types: ['REQUEST', 'SUCCESS', 'FAILURE'],
        endpoint,
        method
      }
    };
    // const error = new Error('Fake error.');

    stub.withArgs({endpoint, schema: undefined, method, body: undefined, version: undefined }).returns(Promise.reject());

    return expect(dispatchWithStoreAndReturn({}, action)).to.eventually.deep.equal({
      type: 'FAILURE',
      error: { msg: `Something bad happend.` },
    });
  });
});