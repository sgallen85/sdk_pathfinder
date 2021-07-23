import { Component } from 'react';
import Icon from '../../reusables/icon/Icon';
import './ControlsOverlay.scss';

interface ControlsOverlayProps {
  onPlay: () => void;
  onPause: () => void;
  onExit: () => void;
}

export default class ControlsOverlay extends Component<ControlsOverlayProps> {
  public render() {
    const { onPlay, onPause, onExit } = this.props;

    return (
      <div className='controls-overlay'>
        <button type='button' className='control-button play-button' onClick={onPlay}>
          <Icon icon='play' />
        </button>
        <button type='button' className='control-button pause-button' onClick={onPause}>
          <Icon icon='stop' />
        </button>
        <button type='button' className='control-button exit-button' onClick={onExit}>
          <Icon icon='close' />
        </button>
      </div>
    );
  }
}