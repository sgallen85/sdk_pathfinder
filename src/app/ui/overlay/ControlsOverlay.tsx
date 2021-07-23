import classNames from 'classnames';
import { Component } from 'react';
import Icon from '../../reusables/icon/Icon';
import './ControlsOverlay.scss';

interface ControlsOverlayProps {
  onPlay: () => void;
  onPause: () => void;
  onExit: () => void;
}

enum ButtonOptions {
  PLAY = 'play',
  PAUSE = 'pause',
  NONE = 'none',
}
interface ControlsOverlayState {
  selectedButton: ButtonOptions;
}

export default class ControlsOverlay extends Component<ControlsOverlayProps, ControlsOverlayState> {
  constructor(props: any) {
    super(props);
    this.state = {
      selectedButton: ButtonOptions.NONE,
    }
  }

  private onPlay = () => {
    this.props.onPlay();
    this.setState({
      selectedButton: ButtonOptions.PLAY,
    });
  }

  private onPause = () => {
    this.props.onPause();
    this.setState({
      selectedButton: ButtonOptions.PAUSE,
    });
  }

  public render() {
    const { onExit } = this.props;
    const { selectedButton } = this.state;

    return (
      <div className='controls-overlay'>
        <button type='button'
          className={classNames(
            'control-button',
            'play-button',
            { 'selected': selectedButton === ButtonOptions.PLAY },
          )}
          onClick={this.onPlay}
        >
          <Icon icon='play' />
        </button>
        <button type='button'
          className={classNames(
            'control-button',
            'pause-button',
            { 'selected': selectedButton === ButtonOptions.PAUSE },
          )}
          onClick={this.onPause}
        >
          <Icon icon='stop' />
        </button>
        <button type='button' className='control-button exit-button' onClick={onExit}>
          <Icon icon='close' />
        </button>
      </div>
    );
  }
}