import { Component } from 'react';
import './MenuNudge.scss';

interface MenuNudgeProps {
  text: string;
  onClose: () => void;
}

interface MenuNudgeState {
  opacity: number;
}

export default class MenuNudge extends Component<MenuNudgeProps, MenuNudgeState> {

  constructor(props: any) {
    super(props);
    this.state = {
      opacity: 0,
    };
  }

  public componentDidMount() {
    setTimeout(() => this.setState({
      opacity: 1,
    }), 30); // HACK: guarantee opacity transition fires, lazy
  }

  public render() {
    const { text, onClose } = this.props;
    const { opacity } = this.state;

    return (
      <div className='menu-nudge-container' style={{ opacity: opacity }}>
        <div className='nudge-text'>{text}</div>
        <button type='button' className='nudge-close-button header-font' onClick={onClose}>CLOSE</button>
      </div>
    );
  }
}