import { CALL_API, Schemas } from '../../middleware/api';
import { SELECT_BOTTON,
  PLAY_PAUSE_REQUEST, PLAY_PAUSE_SUCCESS, PLAY_PAUSE_FAILURE,
  REPLAY_REQUEST, REPLAY_SUCCESS, REPLAY_FAILURE,
  GUIDE_REQUEST, GUIDE_SUCCESS, GUIDE_FAILURE,
  NEXT_REQUEST, NEXT_SUCCESS, NEXT_FAILURE,
  EDIT_MIC_ECHO_REQUEST, EDIT_MIC_ECHO_SUCCESS, EDIT_MIC_ECHO_FAILURE,
  EDIT_MIC_VOLUME_REQUEST, EDIT_MIC_VOLUME_SUCCESS, EDIT_MIC_VOLUME_FAILURE,
  EDIT_MUSIC_VOLUME_REQUEST, EDIT_MUSIC_VOLUME_SUCCESS, EDIT_MUSIC_VOLUME_FAILURE,
  EDIT_PITCH_REQUEST, EDIT_PITCH_SUCCESS, EDIT_PITCH_FAILURE,
  EDIT_EFFECT_REQUEST, EDIT_EFFECT_SUCCESS, EDIT_EFFECT_FAILURE,
  FETCH_PLAYSTATE_REQUEST, FETCH_PLAYSTATE_SUCCESS, FETCH_PLAYSTATE_FAILURE,
  STOP_PLAYER_REQUEST, STOP_PLAYER_SUCCESS, STOP_PLAYER_FAILURE,
  EDIT_PLAY_STATE, EDIT_PITCH_STATE, EDIT_MUTE_STATE,
  EDIT_ECHOMODE_STATE, EDIT_MIC_STATE,
  EDIT_MUSIC_STATE, EDIT_ISSINGING_STATE, EDIT_AUDIOMPX_STATE
} from '../../constants/ActionTypes';
import * as playerActions from '../../actions/player';
import expect from 'expect';
import sinon from 'sinon';

const fakeStore = fakeData => ({
  getState() {
    return fakeData;
  }
});

describe('player actions', () => {

  let stub;

  beforeEach(() => {
    stub = sinon.stub(Date, 'now');
  });

  afterEach(() => {
    stub.restore();
  });

  it('playpause should create CALL_API action', () => {
    expect(playerActions.playpause(1)(action => action, fakeStore({})))
    .toEqual({
      playerState: 1
    })

    expect(playerActions.playpause(1)(action => action, fakeStore({}))[CALL_API])
    .toEqual({
      types: [ PLAY_PAUSE_REQUEST, PLAY_PAUSE_SUCCESS, PLAY_PAUSE_FAILURE ],
      endpoint: '/player/playpause',
      method: 'POST'
    })
  });

  it('repeat should create CALL_API action', () => {
    expect(playerActions.repeat()(action => action, fakeStore({}))[CALL_API])
    .toEqual({
      types: [ REPLAY_REQUEST, REPLAY_SUCCESS, REPLAY_FAILURE ],
      endpoint: '/player/replay',
      method: 'POST'
    })
  });

  it('guide should create CALL_API action', () => {
    expect(playerActions.guide(true)(action => action, fakeStore({})))
    .toEqual({
      state: true
    })

    expect(playerActions.guide(true)(action => action, fakeStore({}))[CALL_API])
    .toEqual({
      types: [ GUIDE_REQUEST, GUIDE_SUCCESS, GUIDE_FAILURE ],
      endpoint: '/player/guide',
      method: 'POST'
    })
  });

  it('next should create CALL_API action', () => {
    expect(playerActions.next()(action => action, fakeStore({}))[CALL_API])
    .toEqual({
      types: [ NEXT_REQUEST, NEXT_SUCCESS, NEXT_FAILURE ],
      endpoint: '/player/next',
      method: 'POST'
    })
  });

  it('micVolumeUp should create CALL_API action', () => {
    expect(playerActions.micVolumeUp()(action => action, fakeStore({})))
    .toEqual({
      name: 'up'
    })

    expect(playerActions.micVolumeUp()(action => action, fakeStore({}))[CALL_API])
    .toEqual({
      types: [ EDIT_MIC_VOLUME_REQUEST, EDIT_MIC_VOLUME_SUCCESS, EDIT_MIC_VOLUME_FAILURE ],
      endpoint: '/effects/mic/volume/up',
      method: 'POST'
    })
  });

  it('echo should create CALL_API action', () => {
    expect(playerActions.echo('small')(action => action, fakeStore({})))
    .toEqual({
      name: 'small'
    })

    expect(playerActions.echo('small')(action => action, fakeStore({}))[CALL_API])
    .toEqual({
      types: [ EDIT_MIC_ECHO_REQUEST, EDIT_MIC_ECHO_SUCCESS, EDIT_MIC_ECHO_FAILURE ],
      endpoint: `/effects/mic/echo/small`,
      method: 'POST'
    })
  });

  it('micVolumeDown should create CALL_API action', () => {
    expect(playerActions.micVolumeDown()(action => action, fakeStore({})))
    .toEqual({
      name: 'down'
    })

    expect(playerActions.micVolumeDown()(action => action, fakeStore({}))[CALL_API])
    .toEqual({
      types: [ EDIT_MIC_VOLUME_REQUEST, EDIT_MIC_VOLUME_SUCCESS, EDIT_MIC_VOLUME_FAILURE ],
      endpoint: '/effects/mic/volume/down',
      method: 'POST'
    })
  });

  it('micMute should create CALL_API action', () => {
    expect(playerActions.micMute())
    .toEqual({
      name: 'mute'
    })

    expect(playerActions.micMute()[CALL_API])
    .toEqual({
      types: [ EDIT_MIC_VOLUME_REQUEST, EDIT_MIC_VOLUME_SUCCESS, EDIT_MIC_VOLUME_FAILURE ],
      endpoint: '/effects/mic/mute',
      method: 'POST'
    })
  });

  it('musicVolumeUp should create CALL_API action', () => {
    expect(playerActions.musicVolumeUp()(action => action, fakeStore({})))
    .toEqual({
      name: 'up'
    })

    expect(playerActions.musicVolumeUp()(action => action, fakeStore({}))[CALL_API])
    .toEqual({
      types: [ EDIT_MUSIC_VOLUME_REQUEST, EDIT_MUSIC_VOLUME_SUCCESS, EDIT_MUSIC_VOLUME_FAILURE ],
      endpoint: '/player/volume/up',
      method: 'POST'
    })
  });

  it('musicVolumeDown should create CALL_API action', () => {
    expect(playerActions.musicVolumeDown()(action => action, fakeStore({})))
    .toEqual({
      name: 'down'
    })

    expect(playerActions.musicVolumeDown()(action => action, fakeStore({}))[CALL_API])
    .toEqual({
      types: [ EDIT_MUSIC_VOLUME_REQUEST, EDIT_MUSIC_VOLUME_SUCCESS, EDIT_MUSIC_VOLUME_FAILURE ],
      endpoint: '/player/volume/down',
      method: 'POST'
    })
  });

  it('musicMute should create CALL_API action', () => {
    expect(playerActions.musicMute(true))
    .toEqual({
      name: 'mute',
      state: true
    })

    expect(playerActions.musicMute(true)[CALL_API])
    .toEqual({
      types: [ EDIT_MUSIC_VOLUME_REQUEST, EDIT_MUSIC_VOLUME_SUCCESS, EDIT_MUSIC_VOLUME_FAILURE ],
      endpoint: '/player/mute',
      method: 'POST'
    })
  });

  it('pitchUp should create CALL_API action', () => {
    expect(playerActions.pitchUp()(action => action, fakeStore({})))
    .toEqual({
      name: 'up'
    })

    expect(playerActions.pitchUp()(action => action, fakeStore({}))[CALL_API])
    .toEqual({
      types: [ EDIT_PITCH_REQUEST, EDIT_PITCH_SUCCESS, EDIT_PITCH_FAILURE ],
      endpoint: '/effects/pitch/up',
      method: 'POST'
    })
  });

  it('pitchDown should create CALL_API action', () => {
    expect(playerActions.pitchDown()(action => action, fakeStore({})))
    .toEqual({
      name: 'down'
    })

    expect(playerActions.pitchDown()(action => action, fakeStore({}))[CALL_API])
    .toEqual({
      types: [ EDIT_PITCH_REQUEST, EDIT_PITCH_SUCCESS, EDIT_PITCH_FAILURE ],
      endpoint: '/effects/pitch/down',
      method: 'POST'
    })
  });

  it('effect should create CALL_API action', () => {
    expect(playerActions.effect('boo')(action => action, fakeStore({})))
    .toEqual({
      name: 'boo'
    })

    expect(playerActions.effect('boo')(action => action, fakeStore({}))[CALL_API])
    .toEqual({
      types: [ EDIT_EFFECT_REQUEST, EDIT_EFFECT_SUCCESS, EDIT_EFFECT_FAILURE ],
      endpoint: `/effects/sfx/boo`,
      method: 'POST'
    })
  });

  it('loadPlayState should create CALL_API action', () => {
    stub.withArgs().returns(1234);

    expect(playerActions.loadPlayState()[CALL_API])
    .toEqual({
      types: [ FETCH_PLAYSTATE_REQUEST, FETCH_PLAYSTATE_SUCCESS, FETCH_PLAYSTATE_FAILURE ],
      endpoint: `/player/state?t=1234`,
      method: 'GET'
    })
  });

  it('editPlayerState should create EDIT_PLAY_STATE action', () => {
    expect(playerActions.editPlayerState(1))
    .toEqual({
      type: EDIT_PLAY_STATE,
      data: 1
    });
  });

  it('editPitchState should create EDIT_PITCH_STATE action', () => {
    expect(playerActions.editPitchState(1))
    .toEqual({
      type: EDIT_PITCH_STATE,
      data: 1
    });
  });

  it('editMuteState should create EDIT_MUTE_STATE action', () => {
    expect(playerActions.editMuteState(1))
    .toEqual({
      type: EDIT_MUTE_STATE,
      data: 1
    });
  });

  it('editEchoModeState should create EDIT_ECHOMODE_STATE action', () => {
    expect(playerActions.editEchoModeState(1))
    .toEqual({
      type: EDIT_ECHOMODE_STATE,
      data: 1
    });
  });

  it('editMicState should create EDIT_MIC_STATE action', () => {
    expect(playerActions.editMicState(1))
    .toEqual({
      type: EDIT_MIC_STATE,
      data: 1
    });
  });

  it('editMusicState should create EDIT_MUSIC_STATE action', () => {
    expect(playerActions.editMusicState(1))
    .toEqual({
      type: EDIT_MUSIC_STATE,
      data: 1
    });
  });

  it('editIsSingingState should create EDIT_ISSINGING_STATE action', () => {
    expect(playerActions.editIsSingingState(1))
    .toEqual( {
      type: EDIT_ISSINGING_STATE,
      data: 1
    });
  });

  it('editAudioMpxState should create EDIT_AUDIOMPX_STATE action', () => {
    expect(playerActions.editAudioMpxState(1))
    .toEqual({
      type: EDIT_AUDIOMPX_STATE,
      data: 1
    });
  });

  it('stopPlayer should create EDIT_AUDIOMPX_STATE action', () => {
    expect(playerActions.stopPlayer()[CALL_API])
    .toEqual({
      types: [ STOP_PLAYER_REQUEST, STOP_PLAYER_SUCCESS, STOP_PLAYER_FAILURE ],
      endpoint: `/player/stop`,
      method: 'POST'
    });
  });
});
