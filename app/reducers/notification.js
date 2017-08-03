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
} from '../constants/ActionTypes';

const initialState = {
  message: '',
  songName: ''
};

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

export default function showNotify( state = initialState, action ) {
  let message;
  switch ( action.type ) {
    case EDIT_DEVICE_HOT_PLUG_STATE:
      message = action.data.action === 'add' ? ADDHOTPLUG : REMOVEHOTPLUG;
      return {
        message,
        hotplugdevice: action.data.desc
      };
    case FLASH_DETECT_FAIL:
      return {
        message: FLASHDETECTFAIL
      }
    case FLASH_VERSION_TOO_OLD:
      return {
        message: FLASHVERSIONTOOOLD
      }
    case PLAY_PAUSE_SUCCESS:
      return { message: action.playerState === 'PLAYING' ? PAUSECONTENT : PLAYCONTENT };
    case STOP_PLAYER_SUCCESS:
      return { message: STOPPLAYERCONTENT }
    case NEXT_SUCCESS:
      return { message: NEXTCONTENT };
    case REPLAY_SUCCESS:
      return { message: REPLAYCONTENT };
    case GUIDE_SUCCESS:
      return { message: GUIDECONTENT };
    case EDIT_EFFECT_SUCCESS:
      return {
        message: action.name === 'applause' ? EFFECTAPPLAUSECONTENT : EFFECTBOOCONTENT
      };
    case EDIT_PITCH_SUCCESS:
      return {
        message: action.name === 'up' ? KEYUPCONTENT : KEYDOWNCONTENT
      };
    case EDIT_MIC_ECHO_SUCCESS:
      if ( action.name === 'short') {
        message = ECHOSHORTCONTENT;
      } else if ( action.name === 'middle' ) {
        message = ECHOMIDDLECONTENT;
      } else if ( action.name === 'long' ) {
        message = ECHOLONGCONTENT;
      } else {
        message = UNKNOWNERROR;
      }
      return { message };
    case EDIT_MIC_VOLUME_SUCCESS:
      switch (action.name) {
        case 'up':
          return { message: MICVOLUMEUPCONTENT }
        case 'down':
          return { message: MICVOLUMEDOWNCONTENT }
        default:
          return state
      }
    case EDIT_MUSIC_VOLUME_SUCCESS:
      switch (action.name) {
        case 'up':
          return { message: MUSICUPCONTENT }
        case 'down':
          return { message: MUSICDOWNCONTENT }
        case 'mute':
          return { message: action.state ? MUTECLOSECONTENT : MUTEOPENCONTENT }
        default:
          return state
      }
    case POST_SUCCESS:
      if ( action.songName ) {
        return {
          message: ADDTOPLAYCONTENT,
          songName: action.songName
        };
      } else if ( action.sharelink ) {
        return {
          message: ADDTOCOLLECTIONSUCCESS
        }
      }
      return { message: action.random ? INSERTSELECTEDFAVORITE : ADDSELECTEDFAVORITE };
    case PUT_SUCCESS:
      if ( action.songName ) {
        return {
          message: INSERTTOPLAYCONTENT,
           songName: action.songName
         };
      } else if ( action.name ) {
        return {
          message: ADDTOFAVORITE,
          songName: action.name
        };
      } else if ( action.isArray ) {
        return {
          message: ADDTOFAVORITESUCCESS
        };
      } else if ( action.next && action.next === 'next' ) {
        return {
          message: INSERTSELECTEDFAVORITE
        };
      } else {
        // TODO
        return {
          message: UNKNOWNERROR
        };
      }
    case DELETE_SUCCESS:
      return {
        message: DELETEFROMFAVORITE,
        songName: action.songName
      };
    case DELETE_QUEUE_SUCCESS:
      return {
        message: DELETEFROMQUEUE,
        songName: action.songName
      };
    /* The failure reducer */
    case PUT_FAILURE:
      if (action.error && action.error.code === 11007) {
        return {
          message: ADDTOFAVORITEFAIL
        };
      } else if (action.error && action.error.code === 11010) {
        return {
          message: ADDTOFAVORITEDUPLICATE
        };
      } else if (action.error && ( action.error.code === 13001 || action.error.code === 11004 ) ) {
        return {
          message: INSERTTOPLAYCONTENT,
          songName: action.songName
        };
      } else if (action.error && action.error.code === 11008) {
        return {
          message: ADDTOPLAYFILLED
        };
      } else if (action.error && action.error.code === 11002) {
        return {
          message: SONGNOTEXIST,
          songName: action.songName
        }
      } else {
        return {
          message: UNKNOWNERROR
        };
      }
    case POST_FAILURE:
      if (action.error && action.error.code === 11008) {
        return {
          message: ADDTOPLAYFILLED
        };
      } else if (action.error && ( action.error.code === 13001 || action.error.code === 11004 ) ) {
        return {
          message: ADDTOPLAYCONTENT,
          songName: action.songName
        };
      } else if (action.error && action.error.code === 11002) {
        return {
          message: SONGNOTEXIST,
          songName: action.songName
        }
      } else if ( action.error && action.error.code === 11000) {
        return {
          message: INVALIDURL
        }
      } else {
        return {
          message: UNKNOWNERROR
        };
      }
    case FULLSCREEN_FAILUE:
      return { message: NOTSUPPORTFULLSCREEN };
    case FETCH_PLAYSTATE_FAILURE:
    case PLAY_PAUSE_FAILURE:
    case NEXT_FAILURE:
    case REPLAY_FAILURE:
    case GUIDE_FAILURE:
    case EDIT_EFFECT_FAILURE:
    case EDIT_PITCH_FAILURE:
    case EDIT_MIC_ECHO_FAILURE:
    case EDIT_MIC_VOLUME_FAILURE:
    case EDIT_MUSIC_VOLUME_FAILURE:
    case STOP_PLAYER_FAILURE:
      if (action.error && ( action.error.code === 13001 || action.error.code === 11004 ) ) {
        return {
          message: APISERVERNOTSTARTED
        };
      } else {
        return {
          message: UNKNOWNERROR
        };
      }
    case POST_PLAYER_FAILURE:
      if ( action.error ) {
        switch ( action.error.code ) {
          case 11012:
            return {
              message: ENABLEMEDIA
            }
          case 11013:
            return {
              message: INSTALLHD
            }
          case 11014:
            return {
              message: ENABLEHD
            }
          case 11015:
            return {
              message: LOGINHD
            }
          case 11016:
            return {
              message: INSTALLPLAYER
            }
          case 11017:
            return {
              message: ENABLEPLAYER
            }
          case 11018:
            return {
              message: CONNECTFAILHD
            }
          case 11019:
            return {
              message: PLAYMEDIA
            }
          case 11020:
            return {
              message: ENABLEHOMEFEATURE
            }
          default:
            return {
              message: UNKNOWNERROR
            };
        }
      } else {
        return {
          message: UNKNOWNERROR
        };
      }
    default:
      return state;
  }
}
