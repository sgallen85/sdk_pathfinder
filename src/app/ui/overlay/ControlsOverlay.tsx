import { Component } from 'react';
import Icon from '../../reusables/icon/Icon';
import './ControlsOverlay.scss';
import ProgressBar from './ProgressBar';

interface ControlsOverlayProps {
  playing: boolean;
  onPlay: () => void;
  onPause: () => void;
  onExit: () => void;
  setU: (u: number) => void;
  u: number;
}

interface ControlsOverlayState {
  rememberPlayState: boolean;
}

export default class ControlsOverlay extends Component<ControlsOverlayProps, ControlsOverlayState> {

  constructor(props: ControlsOverlayProps) {
    super(props);
    this.state = {
      rememberPlayState: true,
    }
  }

  private onScrubMouseDown = () => {
    this.props.onPause();
  }

  private onScrubMouseUp  = () => {
    if (this.state.rememberPlayState) {
      this.props.onPlay();
    }
  }

  private togglePlay = () => {
    const { playing, onPlay, onPause } = this.props;
    playing ? onPause() : onPlay();
    this.setState({ rememberPlayState: !playing })
  }

  public render() {
    const { playing, onExit, setU, u } = this.props;

    return (
      <div className='controls-overlay-container'>
        <div className='controls-overlay'>
          <ProgressBar
            min={0}
            max={1}
            scrub={true}
            onChange={setU}
            onMouseDown={this.onScrubMouseDown}
            onMouseUp={this.onScrubMouseUp}
            overrideValue={u}
          />
          <div className='control-button-container'>
            <button type='button'
              className='control-button play-button'
              onClick={this.togglePlay}
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