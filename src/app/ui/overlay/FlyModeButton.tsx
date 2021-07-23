import { Component } from 'react';
import './FlyModeButton.scss';

interface FlyModeButtonProps {
  onClick: () => void;
}

export default class FlyModeButton extends Component<FlyModeButtonProps> {
  public render() {
    const { onClick } = this.props;
    return (
      <div className='flymode-button-container'>
        <button className='flymode-button' onClick={onClick}>Fly Mode</button>
      </div>
    );
  }
}