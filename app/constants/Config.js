import i18n from './i18n';
let HOST = global.window ?  window.location.protocol + '//' + window.location.hostname : 'http://192.168.0.220/';
let PORT = global.window ? window.location.port : '8080'
if (process.env.NODE_ENV !== 'production') {
  HOST = process.env.API_HOST;
  PORT = process.env.API_PORT;
}

export const API_ROOT = `${HOST}:${PORT}/ktvstation/v1`;
export const APP_ROOT = `${HOST}:${PORT}/ktvstation/`;
export const SOCKETIO_ROOT = `${HOST}:${PORT}/oceanktv`;
export const ROOT = '';
export const HOSTURL = HOST;
export const AUDIO_OUT_PUT_TYPE = {
	usb: 'ic_usb_audio',
	hdmi: 'ic_hdmi_audio',
	analog: 'ic_analog_lineout_audio'
}
export const SOCKETIO_NAMESPACE = '/ktvstation/socket.io';

const browserLang = global.navigator ? (navigator.language || navigator.userLanguage).toLowerCase() : '';
const appLang = browserLang in i18n ? browserLang : 'en';
export const defaultLang = global.localStorage ? (localStorage.getItem('myLang') || appLang) : appLang;
