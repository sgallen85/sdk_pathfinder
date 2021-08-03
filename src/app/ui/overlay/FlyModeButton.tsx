import { Component } from 'react';
import './FlyModeButton.scss';
import { loc } from '../../Localization';

interface FlyModeButtonProps {
  lang: string;
  onClick: () => void;
}

export default class FlyModeButton extends Component<FlyModeButtonProps> {
  public render() {
    const { lang, onClick } = this.props;
    return (
      <div className='flymode-button-container'>
        <button className='flymode-button' onClick={onClick}>{loc('Fly Mode', lang)}</button>
      </div>
    );
  }
}