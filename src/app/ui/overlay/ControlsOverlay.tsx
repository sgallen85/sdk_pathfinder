import { Component } from 'react';
import './ControlsOverlay.scss';

interface ControlsOverlayProps {
  onPlay: () => void;
  onPause: () => void;
  onExit: () => void;
}

export default class ControlsOverlay extends Component<ControlsOverlayProps> {
  public render() {
    const { onPlay, onPause, onExit } = this.props;

    const path = process.env.PUBLIC_URL + '/icons/';

    return (
      <div className='controls-overlay'>
        <button type='button' className='control-button play-button' onClick={onPlay}>
          <img src={path + 'icon-triangle.svg'} alt='Play' />
        </button>
        <button type='button' className='control-button pause-button' onClick={onPause}>
          <img src={path + 'icon-rectangle.svg'} alt='Pause' />
        </button>
        <button type='button' className='control-button exit-button' onClick={onExit}>
        <img src={path + 'icon-x-lg.svg'} alt='Exit' />
        </button>
      </div>
    );
  }
}