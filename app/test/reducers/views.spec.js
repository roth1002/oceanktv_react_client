import { expect } from 'chai';
import viewsReducers from '../../reducers/views';
import { TOGGLE_VIEW } from '../../constants/ActionTypes';

const initialState = {
  footer: { visible: true },
  slidePanel: { visible: false },
  moreSettingPanel: { visible: false },
  modal: { visible: false },
  theme: { current: undefined, preview: undefined },
  app: { disabled: false },
  notification: { visible: false },
  langSettingPanel: { visible: false }
};

describe('views reducers', () => {
  it('should handle initial state', () => {
    expect( viewsReducers(undefined, {}) ).to.deep.equal(initialState);
  });


  describe('footer reducer', () => {
    it('should do nothing when component is not footer', () => {
      expect(
        viewsReducers(initialState, {component: 'others'})
      ).to.deep.equal(initialState);
    });

    it('should do nothing when type is not TOGGLE_VIEW', () => {
      expect(
        viewsReducers(initialState, {component: 'footer', type: 'else'})
      ).to.deep.equal(initialState);
    });

    it('should throw error if type of action.state is not a object', () => {
      try {
        viewsReducers(initialState, {component: 'footer', type: TOGGLE_VIEW });
      } catch (e) {
        expect(e.message).to.equal('Expoect the state of component to be a object');
      }
    });

    it('should handle TOGGLE_VIEW when component is footer', () => {
      expect(
        viewsReducers(initialState, {component: 'footer', type: TOGGLE_VIEW, state: { visible: false }})
      ).to.deep.equal(Object.assign({}, initialState, { footer: { visible: false }}));
    });
  });


  describe('slidePanel reducer', () => {
    it('should do nothing when component is not slidePanel', () => {
      expect(
        viewsReducers(initialState, {component: 'others'})
      ).to.deep.equal(initialState);
    });

    it('should do nothing when type is not TOGGLE_VIEW', () => {
      expect(
        viewsReducers(initialState, {component: 'slidePanel', type: 'else'})
      ).to.deep.equal(initialState);
    });

    it('should throw error if type of action.state is not a object', () => {
      try {
        viewsReducers(initialState, {component: 'slidePanel', type: TOGGLE_VIEW });
      } catch (e) {
        expect(e.message).to.equal('Expoect the state of component to be a object');
      }
    });

    it('should handle TOGGLE_VIEW when component is slidePanel', () => {
      expect(
        viewsReducers(initialState, {component: 'slidePanel', type: TOGGLE_VIEW, state: { visible: true }})
      ).to.deep.equal(Object.assign({}, initialState, { slidePanel: { visible: true }}));
    });
  });


  describe('moreSettingPanel reducer', () => {
    it('should do nothing when component is not moreSettingPanel', () => {
      expect(
        viewsReducers(initialState, {component: 'others'})
      ).to.deep.equal(initialState);
    });

    it('should do nothing when type is not TOGGLE_VIEW', () => {
      expect(
        viewsReducers(initialState, {component: 'moreSettingPanel', type: 'else'})
      ).to.deep.equal(initialState);
    });

    it('should throw error if type of action.state is not a object', () => {
      try {
        viewsReducers(initialState, {component: 'moreSettingPanel', type: TOGGLE_VIEW });
      } catch (e) {
        expect(e.message).to.equal('Expoect the state of component to be a object');
      }
    });

    it('should handle TOGGLE_VIEW when component is moreSettingPanel', () => {
      expect(
        viewsReducers(initialState, {component: 'moreSettingPanel', type: TOGGLE_VIEW, state: { visible: true }})
      ).to.deep.equal(Object.assign({}, initialState, { moreSettingPanel: { visible: true }}));
    });
  });


  describe('modal reducer', () => {
    it('should do nothing when component is not modal', () => {
      expect(
        viewsReducers(initialState, {component: 'others'})
      ).to.deep.equal(initialState);
    });

    it('should do nothing when type is not TOGGLE_VIEW', () => {
      expect(
        viewsReducers(initialState, {component: 'modal', type: 'else'})
      ).to.deep.equal(initialState);
    });

    it('should throw error if type of action.state is not a object', () => {
      try {
        viewsReducers(initialState, {component: 'modal', type: TOGGLE_VIEW });
      } catch (e) {
        expect(e.message).to.equal('Expoect the state of component to be a object');
      }
    });

    it('should handle TOGGLE_VIEW when component is modal', () => {
      expect(
        viewsReducers(initialState, {component: 'modal', type: TOGGLE_VIEW, state: { visible: true }})
      ).to.deep.equal(Object.assign({}, initialState, { modal: { visible: true }}));
    });
  });


  describe('theme reducer', () => {
    it('should do nothing when component is not theme', () => {
      expect(
        viewsReducers(initialState, {component: 'others'})
      ).to.deep.equal(initialState);
    });

    it('should do nothing when type is not TOGGLE_VIEW', () => {
      expect(
        viewsReducers(initialState, {component: 'theme', type: 'else'})
      ).to.deep.equal(initialState);
    });

    it('should throw error if type of action.state is not a object', () => {
      try {
        viewsReducers(initialState, {component: 'theme', type: TOGGLE_VIEW });
      } catch (e) {
        expect(e.message).to.equal('Expoect the state of component to be a object');
      }
    });

    it('should handle TOGGLE_VIEW when component is theme', () => {
      expect(
        viewsReducers(initialState, {component: 'theme', type: TOGGLE_VIEW, state: { current: 'Test-A', preview: 'Test-B' }})
      ).to.deep.equal(Object.assign({}, initialState, { theme: { current: 'Test-A', preview: 'Test-B' }}));
    });
  });


  describe('app reducer', () => {
    it('should do nothing when component is not app', () => {
      expect(
        viewsReducers(initialState, {component: 'others'})
      ).to.deep.equal(initialState);
    });

    it('should do nothing when type is not TOGGLE_VIEW', () => {
      expect(
        viewsReducers(initialState, {component: 'app', type: 'else'})
      ).to.deep.equal(initialState);
    });

    it('should throw error if type of action.state is not a object', () => {
      try {
        viewsReducers(initialState, {component: 'app', type: TOGGLE_VIEW });
      } catch (e) {
        expect(e.message).to.equal('Expoect the state of component to be a object');
      }
    });

    it('should handle TOGGLE_VIEW when component is app', () => {
      expect(
        viewsReducers(initialState, {component: 'app', type: TOGGLE_VIEW, state: { disabled: true }})
      ).to.deep.equal(Object.assign({}, initialState, { app: { disabled: true }}));
    });
  });
});