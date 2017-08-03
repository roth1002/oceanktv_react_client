import expect from 'expect';
import notificationReducer from '../../reducers/notification';
import {
  EDIT_DEVICE_HOT_PLUG_STATE,
  FLASH_DETECT_FAIL,
  FLASH_VERSION_TOO_OLD,
  PLAY_PAUSE_SUCCESS,
  STOP_PLAYER_SUCCESS,
  NEXT_SUCCESS,
  REPLAY_SUCCESS,
  GUIDE_SUCCESS,
  EDIT_EFFECT_SUCCESS,
  EDIT_PITCH_SUCCESS,
  EDIT_MIC_ECHO_SUCCESS,
  EDIT_MIC_VOLUME_SUCCESS,
  EDIT_MUSIC_VOLUME_SUCCESS,
  POST_SUCCESS,
  PUT_SUCCESS,
  DELETE_SUCCESS,
  DELETE_QUEUE_SUCCESS,
  PLAY_PAUSE_FAILURE,
  STOP_PLAYER_FAILURE,
  NEXT_FAILURE,
  REPLAY_FAILURE,
  GUIDE_FAILURE,
  EDIT_EFFECT_FAILURE,
  EDIT_PITCH_FAILURE,
  EDIT_MIC_ECHO_FAILURE,
  EDIT_MIC_VOLUME_FAILURE,
  EDIT_MUSIC_VOLUME_FAILURE,
  POST_FAILURE,
  PUT_FAILURE,
  DELETE_FAILURE,
  DELETE_QUEUE_FAILURE,
  FETCH_PLAYSTATE_FAILURE,
  FULLSCREEN_FAILUE,
  POST_PLAYER_FAILURE
} from '../../constants/ActionTypes';

const initialState = {
	message: '',
  songName: ''
}

const PLAYPAUSECONTENT       = 'notify.playpause';
const PLAYCONTENT            = 'notify.play';
const PAUSECONTENT           = 'notify.pause';
const STOPPLAYERCONTENT      = 'notify.stop';
const NEXTCONTENT            = 'notify.next';
const REPLAYCONTENT          = 'notify.replay';
const GUIDECONTENT           = 'notify.guide';
const GUIDEOPENCONTENT       = 'notify.guide.open';
const GUIDECLOSECONTENT      = 'notify.guide.close';
const EFFECTAPPLAUSECONTENT  = 'notify.applause';
const EFFECTBOOCONTENT       = 'notify.boo';
const KEYUPCONTENT           = 'notify.key.up';
const KEYDOWNCONTENT         = 'notify.key.down';
const ECHOSHORTCONTENT       = 'notify.echo.small';
const ECHOMIDDLECONTENT      = 'notify.echo.middle';
const ECHOLONGCONTENT        = 'notify.echo.large';
const MICVOLUMEUPCONTENT     = 'notify.mic.volume.up';
const MICVOLUMEDOWNCONTENT   = 'notify.mic.volume.down';
const MICMUTECONTENT         = 'notify.mic.volume.mute'
const MUSICUPCONTENT         = 'notify.music.volume.up';
const MUSICDOWNCONTENT       = 'notify.music.volume.down';
const MUSICMUTECONTENT       = 'notify.music.volume.mute';
const MUTEOPENCONTENT        = 'notify.volume.mute.open';
const MUTECLOSECONTENT       = 'notify.volume.mute.close';
const ADDSELECTEDFAVORITE    = 'notify.already.addAll';
const INSERTSELECTEDFAVORITE = 'notify.already.addAllRandom'
const ADDTOPLAYCONTENT       = 'notify.addPlay';
const INSERTTOPLAYCONTENT    = 'notify.insertPlay';
const DELETEFROMFAVORITE     = 'notify.remove.from.favor';
const ADDTOFAVORITE          = 'notify.add.to.favor';
const DELETEFROMQUEUE        = 'notify.remove.from.order';
const ADDTOFAVORITEFAIL      = 'notify.add.to.favor.failure.prefix';
const ADDTOFAVORITEDUPLICATE = 'notify.add.to.favor.duplicate';
const ADDTOPLAYFILLED        = 'notify.addPlay.filled';
const APISERVERNOTSTARTED    = 'notify.apiserver.notready';
const ADDTOFAVORITESUCCESS   = 'notify.add.to.favor.success';
const NOTSUPPORTFULLSCREEN   = 'notify.not.support.fullscreen';
const UNKNOWNERROR           = 'notify.unknown.error';
const LOGINHD                = 'notify.hdstation.login';
const INSTALLHD              = 'notify.hdstation.install';
const ENABLEHD               = 'notify.hdstation.enable';
const INSTALLPLAYER          = 'notify.tvplayer.install';
const ENABLEPLAYER           = 'notify.tvplayer.enable';
const ENABLEMEDIA            = 'notify.medialibrary.enable';
const PLAYMEDIA              = 'notify.medialibrary.play';
const ENABLEHOMEFEATURE      = 'notify.homefeature.enable';
const ADDHOTPLUG             = 'notify.hotplug.add';
const REMOVEHOTPLUG          = 'notify.hotplug.remove';
const CONNECTFAILHD          = 'notify.hdstation.connect.fail';
const SONGNOTEXIST           = 'notify.songs.not.exist';
const FLASHDETECTFAIL        = 'notify.flash.detect.fail';
const FLASHVERSIONTOOOLD     = 'notify.flash.version.too.old';
const ADDTOCOLLECTIONSUCCESS = 'notify.add.to.collect.success';
const INVALIDURL             = 'notify.add.to.collect.failure';

describe('notification reducer', () => {
  it('should handle initial state', () => {
    expect(
      notificationReducer(undefined, {})
    ).toEqual(initialState);
  });

  it('should handle EDIT_DEVICE_HOT_PLUG_STATE', () => {
    expect(
      notificationReducer(initialState, { type: EDIT_DEVICE_HOT_PLUG_STATE, data: { action: 'add', desc: 'GG' } })
    ).toEqual({
      message: ADDHOTPLUG,
      hotplugdevice: 'GG'
    });

    expect(
      notificationReducer(initialState, { type: EDIT_DEVICE_HOT_PLUG_STATE, data: { action: 'remove', desc: 'GG' } })
    ).toEqual({
      message: REMOVEHOTPLUG,
      hotplugdevice: 'GG'
    });
  });

  it('should handle FLASH_DETECT_FAIL', () => {
    expect(
      notificationReducer(initialState, { type: FLASH_DETECT_FAIL })
    ).toEqual({
      message: FLASHDETECTFAIL
    });
  });

  it('should handle FLASH_VERSION_TOO_OLD', () => {
    expect(
      notificationReducer(initialState, { type: FLASH_VERSION_TOO_OLD })
    ).toEqual({
      message: FLASHVERSIONTOOOLD
    });
  });

  describe('success notification handlers', () => {
    it('should handle PLAY_PAUSE_SUCCESS', () => {
    	expect(
    	  notificationReducer(initialState, { type: PLAY_PAUSE_SUCCESS, playerState: 'PLAYING' })
    	).toEqual({ message: PAUSECONTENT });

      expect(
        notificationReducer(initialState, { type: PLAY_PAUSE_SUCCESS, playerState: 'NOTPLAYING' })
      ).toEqual({ message: PLAYCONTENT });
    });

    it('should handle STOP_PLAYER_SUCCESS', () => {
      expect(
        notificationReducer(initialState, { type: STOP_PLAYER_SUCCESS })
      ).toEqual({ message: STOPPLAYERCONTENT });
    });

    it('should handle NEXT_SUCCESS', () => {
      expect(
        notificationReducer(initialState, { type: NEXT_SUCCESS })
      ).toEqual({ message: NEXTCONTENT });
    });

    it('should handle REPLAY_SUCCESS', () => {
      expect(
        notificationReducer(initialState, { type: REPLAY_SUCCESS })
      ).toEqual({ message: REPLAYCONTENT });
    });

    it('should handle GUIDE_SUCCESS', () => {
      expect(
        notificationReducer(initialState, { type: GUIDE_SUCCESS, state: 'hasState' })
      ).toEqual({ message: GUIDECONTENT });

      expect(
        notificationReducer(initialState, { type: GUIDE_SUCCESS, state: undefined })
      ).toEqual({ message: GUIDECONTENT });
    });

    it('should handle EDIT_EFFECT_SUCCESS', () => {
      expect(
        notificationReducer(initialState, { type: EDIT_EFFECT_SUCCESS, name: 'applause' })
      ).toEqual({ message: EFFECTAPPLAUSECONTENT });

      expect(
        notificationReducer(initialState, { type: EDIT_EFFECT_SUCCESS, name: undefined })
      ).toEqual({ message: EFFECTBOOCONTENT });
    });

    it('should handle EDIT_PITCH_SUCCESS', () => {
      expect(
        notificationReducer(initialState, { type: EDIT_PITCH_SUCCESS, name: 'up' })
      ).toEqual({ message: KEYUPCONTENT });

      expect(
        notificationReducer(initialState, { type: EDIT_PITCH_SUCCESS, name: undefined })
      ).toEqual({ message: KEYDOWNCONTENT });
    });

    it('should handle EDIT_MIC_ECHO_SUCCESS', () => {
      expect(
        notificationReducer(initialState, { type: EDIT_MIC_ECHO_SUCCESS, name: 'short' })
      ).toEqual({ message: ECHOSHORTCONTENT });

      expect(
        notificationReducer(initialState, { type: EDIT_MIC_ECHO_SUCCESS, name: 'middle' })
      ).toEqual({ message: ECHOMIDDLECONTENT });

      expect(
        notificationReducer(initialState, { type: EDIT_MIC_ECHO_SUCCESS, name: 'long' })
      ).toEqual({ message: ECHOLONGCONTENT });

      expect(
        notificationReducer(initialState, { type: EDIT_MIC_ECHO_SUCCESS, name: undefined })
      ).toEqual({ message: UNKNOWNERROR });
    });

    it('should handle EDIT_MIC_VOLUME_SUCCESS', () => {
      expect(
        notificationReducer(initialState, { type: EDIT_MIC_VOLUME_SUCCESS, name: 'up' })
      ).toEqual({ message: MICVOLUMEUPCONTENT });

      expect(
        notificationReducer(initialState, { type: EDIT_MIC_VOLUME_SUCCESS, name: 'down' })
      ).toEqual({ message: MICVOLUMEDOWNCONTENT });

      expect(
        notificationReducer(initialState, { type: EDIT_MIC_VOLUME_SUCCESS, name: undefined })
      ).toEqual(initialState);
    });

    it('should handle EDIT_MUSIC_VOLUME_SUCCESS', () => {
      expect(
        notificationReducer(initialState, { type: EDIT_MUSIC_VOLUME_SUCCESS, name: 'up' })
      ).toEqual({ message: MUSICUPCONTENT });

      expect(
        notificationReducer(initialState, { type: EDIT_MUSIC_VOLUME_SUCCESS, name: 'down' })
      ).toEqual({ message: MUSICDOWNCONTENT });

      expect(
        notificationReducer(initialState, { type: EDIT_MUSIC_VOLUME_SUCCESS, name: 'mute', state: 'hasState' })
      ).toEqual({ message: MUTECLOSECONTENT });

      expect(
        notificationReducer(initialState, { type: EDIT_MUSIC_VOLUME_SUCCESS, name: 'mute', state: undefined })
      ).toEqual({ message: MUTEOPENCONTENT });

      expect(
        notificationReducer(initialState, { type: EDIT_MUSIC_VOLUME_SUCCESS, name: undefined })
      ).toEqual(initialState);
    });

    it('should handle POST_SUCCESS', () => {
      expect(
        notificationReducer(initialState, { type: POST_SUCCESS, songName: 'Let it go' })
      ).toEqual(Object.assign({}, initialState, { message: ADDTOPLAYCONTENT, songName: 'Let it go' }));

      expect(
        notificationReducer(initialState, { type: POST_SUCCESS, songName: undefined, random: 'random' })
      ).toEqual({ message: INSERTSELECTEDFAVORITE });

      expect(
        notificationReducer(initialState, { type: POST_SUCCESS, songName: undefined, random: undefined })
      ).toEqual({ message: ADDSELECTEDFAVORITE });

      expect(
        notificationReducer(initialState, { type: POST_SUCCESS, sharelink: 'XXX' })
      ).toEqual({ message: ADDTOCOLLECTIONSUCCESS });
    });

    it('should handle PUT_SUCCESS', () => {
      expect(
        notificationReducer(initialState, { type: PUT_SUCCESS, songName: 'Let it go' })
      ).toEqual(Object.assign({}, initialState, { message: INSERTTOPLAYCONTENT, songName: 'Let it go' }));

      expect(
        notificationReducer(initialState, { type: PUT_SUCCESS, songName: undefined, name: 'Roth' })
      ).toEqual(Object.assign({}, initialState, { message: ADDTOFAVORITE, songName: 'Roth' }));

      expect(
        notificationReducer(initialState, { type: PUT_SUCCESS, songName: undefined, name: undefined, isArray: true })
      ).toEqual({ message: ADDTOFAVORITESUCCESS });

      expect(
        notificationReducer(initialState, { type: PUT_SUCCESS, songName: undefined, name: undefined, isArray: false, next: 'next' })
      ).toEqual({ message: INSERTSELECTEDFAVORITE });

      expect(
        notificationReducer(initialState, { type: PUT_SUCCESS, songName: undefined, name: undefined, isArray: undefined, next: undefined })
      ).toEqual({ message: UNKNOWNERROR });
    });

    it('should handle DELETE_SUCCESS', () => {
      expect(
        notificationReducer(initialState, { type: DELETE_SUCCESS, songName: 'Let it go' })
      ).toEqual(Object.assign({}, initialState, { message: DELETEFROMFAVORITE, songName: 'Let it go' }));
    });

    it('should handle DELETE_QUEUE_SUCCESS', () => {
      expect(
        notificationReducer(initialState, { type: DELETE_QUEUE_SUCCESS, songName: 'Let it go' })
      ).toEqual(Object.assign({}, initialState, { message: DELETEFROMQUEUE, songName: 'Let it go' }));
    });
  });

  describe('failure notification handlers', () => {
    it('should handle PUT_FAILURE', () => {
      expect(
        notificationReducer(initialState, { type: PUT_FAILURE, error: { code: 11007 }})
      ).toEqual({ message: ADDTOFAVORITEFAIL });

      expect(
        notificationReducer(initialState, { type: PUT_FAILURE, error: { code: 11010 }})
      ).toEqual({ message: ADDTOFAVORITEDUPLICATE });

      expect(
        notificationReducer(initialState, { type: PUT_FAILURE, error: { code: 13001 }, songName: 'Suger'})
      ).toEqual({ message: INSERTTOPLAYCONTENT, songName: 'Suger' });

      expect(
        notificationReducer(initialState, { type: PUT_FAILURE, error: { code: 11008 }})
      ).toEqual({ message: ADDTOPLAYFILLED });

      expect(
        notificationReducer(initialState, { type: PUT_FAILURE, error: { code: 11002 }, songName: 'Suger'})
      ).toEqual({ message: SONGNOTEXIST, songName: 'Suger' });

      expect(
        notificationReducer(initialState, { type: PUT_FAILURE, error: { code: undefined }})
      ).toEqual({ message: UNKNOWNERROR });
    });

    it('should handle POST_FAILURE', () => {
      expect(
        notificationReducer(initialState, { type: POST_FAILURE, error: { code: 11008 }})
      ).toEqual({ message: ADDTOPLAYFILLED });

      expect(
        notificationReducer(initialState, { type: POST_FAILURE, error: { code: 13001 }, songName: 'Suger'})
      ).toEqual({ message: ADDTOPLAYCONTENT, songName: 'Suger' });

      expect(
        notificationReducer(initialState, { type: POST_FAILURE, error: { code: 11002 }, songName: 'Suger'})
      ).toEqual({ message: SONGNOTEXIST, songName: 'Suger' });

      expect(
        notificationReducer(initialState, { type: POST_FAILURE, error: { code: undefined }})
      ).toEqual({ message: UNKNOWNERROR });

      expect(
        notificationReducer(initialState, { type: POST_FAILURE, error: { code: 11000 }})
      ).toEqual({ message: INVALIDURL });
    });

    it('should handle FULLSCREEN_FAILUE', () => {
      expect(
        notificationReducer(initialState, { type: FULLSCREEN_FAILUE })
      ).toEqual({ message: NOTSUPPORTFULLSCREEN });
    });

    it('should handle FETCH_PLAYSTATE_FAILURE', () => {
      expect(
        notificationReducer(initialState, { type: FETCH_PLAYSTATE_FAILURE, error: { code: 13001 }})
      ).toEqual({ message: APISERVERNOTSTARTED });

      expect(
        notificationReducer(initialState, { type: FETCH_PLAYSTATE_FAILURE, error: { code: undefined }})
      ).toEqual({ message: UNKNOWNERROR });
    });

    it('should handle PLAY_PAUSE_FAILURE', () => {
      expect(
        notificationReducer(initialState, { type: PLAY_PAUSE_FAILURE, error: { code: 13001 }})
      ).toEqual({ message: APISERVERNOTSTARTED });

      expect(
        notificationReducer(initialState, { type: PLAY_PAUSE_FAILURE, error: { code: undefined }})
      ).toEqual({ message: UNKNOWNERROR });
    });

    it('should handle NEXT_FAILURE', () => {
      expect(
        notificationReducer(initialState, { type: NEXT_FAILURE, error: { code: 13001 }})
      ).toEqual({ message: APISERVERNOTSTARTED });

      expect(
        notificationReducer(initialState, { type: NEXT_FAILURE, error: { code: undefined }})
      ).toEqual({ message: UNKNOWNERROR });
    });

    it('should handle REPLAY_FAILURE', () => {
      expect(
        notificationReducer(initialState, { type: REPLAY_FAILURE, error: { code: 13001 }})
      ).toEqual({ message: APISERVERNOTSTARTED });

      expect(
        notificationReducer(initialState, { type: REPLAY_FAILURE, error: { code: undefined }})
      ).toEqual({ message: UNKNOWNERROR });
    });

    it('should handle GUIDE_FAILURE', () => {
      expect(
        notificationReducer(initialState, { type: GUIDE_FAILURE, error: { code: 13001 }})
      ).toEqual({ message: APISERVERNOTSTARTED });

      expect(
        notificationReducer(initialState, { type: GUIDE_FAILURE, error: { code: undefined }})
      ).toEqual({ message: UNKNOWNERROR });
    });

    it('should handle EDIT_EFFECT_FAILURE', () => {
      expect(
        notificationReducer(initialState, { type: EDIT_EFFECT_FAILURE, error: { code: 13001 }})
      ).toEqual({ message: APISERVERNOTSTARTED });

      expect(
        notificationReducer(initialState, { type: EDIT_EFFECT_FAILURE, error: { code: undefined }})
      ).toEqual({ message: UNKNOWNERROR });
    });

    it('should handle EDIT_PITCH_FAILURE', () => {
      expect(
        notificationReducer(initialState, { type: EDIT_PITCH_FAILURE, error: { code: 13001 }})
      ).toEqual({ message: APISERVERNOTSTARTED });

      expect(
        notificationReducer(initialState, { type: EDIT_PITCH_FAILURE, error: { code: undefined }})
      ).toEqual({ message: UNKNOWNERROR });
    });

    it('should handle EDIT_MIC_ECHO_FAILURE', () => {
      expect(
        notificationReducer(initialState, { type: EDIT_MIC_ECHO_FAILURE, error: { code: 13001 }})
      ).toEqual({ message: APISERVERNOTSTARTED });

      expect(
        notificationReducer(initialState, { type: EDIT_MIC_ECHO_FAILURE, error: { code: undefined }})
      ).toEqual({ message: UNKNOWNERROR });
    });

    it('should handle EDIT_MIC_VOLUME_FAILURE', () => {
      expect(
        notificationReducer(initialState, { type: EDIT_MIC_VOLUME_FAILURE, error: { code: 13001 }})
      ).toEqual({ message: APISERVERNOTSTARTED });

      expect(
        notificationReducer(initialState, { type: EDIT_MIC_VOLUME_FAILURE, error: { code: undefined }})
      ).toEqual({ message: UNKNOWNERROR });
    });

    it('should handle EDIT_MUSIC_VOLUME_FAILURE', () => {
      expect(
        notificationReducer(initialState, { type: EDIT_MUSIC_VOLUME_FAILURE, error: { code: 13001 }})
      ).toEqual({ message: APISERVERNOTSTARTED });

      expect(
        notificationReducer(initialState, { type: EDIT_MUSIC_VOLUME_FAILURE, error: { code: undefined }})
      ).toEqual({ message: UNKNOWNERROR });
    });

    it('should handle STOP_PLAYER_FAILURE', () => {
      expect(
        notificationReducer(initialState, { type: STOP_PLAYER_FAILURE, error: { code: 13001 }})
      ).toEqual({ message: APISERVERNOTSTARTED });

      expect(
        notificationReducer(initialState, { type: STOP_PLAYER_FAILURE, error: { code: undefined }})
      ).toEqual({ message: UNKNOWNERROR });
    });

    it('should handle POST_PLAYER_FAILURE', () => {
      expect(
        notificationReducer(initialState, { type: POST_PLAYER_FAILURE, error: { code: 11012 }})
      ).toEqual({ message: ENABLEMEDIA });

      expect(
        notificationReducer(initialState, { type: POST_PLAYER_FAILURE, error: { code: 11013 }})
      ).toEqual({ message: INSTALLHD });

      expect(
        notificationReducer(initialState, { type: POST_PLAYER_FAILURE, error: { code: 11014 }})
      ).toEqual({ message: ENABLEHD });

      expect(
        notificationReducer(initialState, { type: POST_PLAYER_FAILURE, error: { code: 11015 }})
      ).toEqual({ message: LOGINHD });

      expect(
        notificationReducer(initialState, { type: POST_PLAYER_FAILURE, error: { code: 11016 }})
      ).toEqual({ message: INSTALLPLAYER });

      expect(
        notificationReducer(initialState, { type: POST_PLAYER_FAILURE, error: { code: 11017 }})
      ).toEqual({ message: ENABLEPLAYER });

      expect(
        notificationReducer(initialState, { type: POST_PLAYER_FAILURE, error: { code: 11018 }})
      ).toEqual({ message: CONNECTFAILHD });

      expect(
        notificationReducer(initialState, { type: POST_PLAYER_FAILURE, error: { code: 11019 }})
      ).toEqual({ message: PLAYMEDIA });

      expect(
        notificationReducer(initialState, { type: POST_PLAYER_FAILURE, error: { code: 11020 }})
      ).toEqual({ message: ENABLEHOMEFEATURE });

      expect(
        notificationReducer(initialState, { type: POST_PLAYER_FAILURE, error: { code: undefined }})
      ).toEqual({ message: UNKNOWNERROR });

      expect(
        notificationReducer(initialState, { type: POST_PLAYER_FAILURE })
      ).toEqual({ message: UNKNOWNERROR });
    });
  });
});