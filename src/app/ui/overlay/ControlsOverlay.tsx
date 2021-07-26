import { Component } from 'react';
import Icon from '../../reusables/icon/Icon';
import ScrubBar from './ScrubBar';
import './ControlsOverlay.scss';

interface ControlsOverlayProps {
  playing: boolean;
  onPlay: () => void;
  onPause: () => void;
  onExit: () => void;
  setU: (u: number) => void;
  u: number;
}

export default class ControlsOverlay extends Component<ControlsOverlayProps> {

  public render() {
    const { playing, onPlay, onPause, onExit, setU, u } = this.props;

    return (
      <div className='controls-overlay-container'>
        <div className='controls-overlay'>
          <ScrubBar 
            onMouseDown={onPause}
            onMouseUp={onPlay}
            onChange={(e) => setU(parseFloat(e.target.value))}
            u={u}
          />
          <div className='control-button-container'>
            <button type='button'
              className='control-button play-button'
              onClick={playing ? onPause : onPlay}
            >
              <Icon icon={playing ? 'showcase-pause-lg' : 'showcase-play-lg'} classes='play-pause-button' />
            </button>
            <button type='button' className='control-button exit-button' onClick={onExit}>
              <Icon icon='close' />
            </button>
          </div>
        </div>
      </div>
    );

  }
}