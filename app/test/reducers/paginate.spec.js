import { expect } from 'chai';
import paginateFunction from '../../reducers/paginate';

describe('paginate', () => {
  it('should throw error if types is not an array', () => {
    try {
      paginateFunction({ types: 'a', mapActionToKey: () => 'test' })
    } catch (e) {
      expect(e.message).to.equal('Expected types to be an array of three elements.');
    }
  });

  it('should throw error if types is not an array of three elements', () => {
    try {
      paginateFunction({ types: ['a','b'], mapActionToKey: () => 'test' })
    } catch (e) {
      expect(e.message).to.equal('Expected types to be an array of three elements.');
    }
  });

  it('should throw error if element of types is not a string ', () => {
    try {
      paginateFunction({ types: [1, 2, 3], mapActionToKey: () => 'test' })
    } catch (e) {
      expect(e.message).to.equal('Expected types to be strings.');
    }
  });

  it('should throw error if mapActionToKey is not a function', () => {
    try {
      paginateFunction({ types: ['a','b','c'], mapActionToKey: 'test' })
    } catch (e) {
      expect(e.message).to.equal('Expected mapActionToKey to be a function.');
    }
  });
});