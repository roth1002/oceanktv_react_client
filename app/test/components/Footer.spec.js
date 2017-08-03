import expect from 'expect';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import Footer from '../../components/Footer';
import i18n from '../../constants/i18n';
import * as playerActions from '../../actions/player';
import { defaultLang } from '../../constants/Config';

const i18nData = Object.assign({}, i18n, { myLang: defaultLang })

function setup() {
	let props = {
		viewState: {
			visible: true
		},
		toggleNotification: expect.createSpy(),
		i18n: i18nData,
		player: {
			echoMode: 'MIDDLE',
			guiState: 'MUSIC',
			micVolume: 80,
			musicVolume: 80,
			mute: false,
			pitchValue: 0,
			playState: "STOPPED",
			selected: ' ',
			visible: false
		},
		playerActions,
		handlePanelViisibility: expect.createSpy(),
		visiblePanel: ''
	}

	let renderer = TestUtils.createRenderer();
	renderer.render(<Footer {...props} />);
	let output = renderer.getRenderOutput();

	return {
		props,
		output,
		renderer
	}
}

describe('components', () => {
	describe('Footer', () => {
    it('should render correctly', () => {
      const { output } = setup();

      expect(output.type).toBe('div');

      let footer = output.props.children

      expect(footer.type).toBe('footer');
      expect(footer.props.className).toBe('Footer is-visible');

      let [
      	renderStop,
      	renderPlayPause,
      	renderNext,
      	renderRepeat,
      	renderGuide,
      	renderEffect,
      	renderAllMute,
      	renderMicEcho,
      	renderPitch,
      	renderMicVolume,
      	renderMusicVolume
      ] = footer.props.children;

      expect(renderStop.type).toBe('div');
      expect(renderStop.props.className).toBe('Footer-btn Footer-btn-withStop');
      expect(renderPlayPause.type).toBe('div');
      expect(renderPlayPause.props.className).toBe('Footer-btn');
      expect(renderNext.type).toBe('div');
      expect(renderNext.props.className).toBe('Footer-btn');
      expect(renderRepeat.type).toBe('div');
      expect(renderRepeat.props.className).toBe('Footer-btn');
      expect(renderGuide.type).toBe('div');
      expect(renderGuide.props.className).toBe('Footer-btn');
      expect(renderEffect.type).toBe('div');
      expect(renderEffect.props.className).toBe('Footer-btn');
      expect(renderAllMute.type).toBe('div');
      expect(renderAllMute.props.className).toBe('Footer-btn');
      expect(renderMicEcho.type).toBe('div');
      expect(renderMicEcho.props.className).toBe('Footer-btn-withPanel');
      expect(renderPitch.type).toBe('div');
      expect(renderPitch.props.className).toBe('Footer-btn-withPanel');
      expect(renderMicVolume.type).toBe('div');
      expect(renderMicVolume.props.className).toBe('Footer-btn-withPanel');
      expect(renderMusicVolume.type).toBe('div');
      expect(renderMusicVolume.props.className).toBe('Footer-btn-withPanel Footer-btn-withPanel--music');

    })
	});
});

