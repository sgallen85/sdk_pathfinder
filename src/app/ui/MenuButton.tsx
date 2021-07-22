import classNames from 'classnames';
import { Component } from 'react';
import './MenuButton.scss';

interface MenuButtonProps {
  text?: string;
  onClick: () => void;
}

export default class MenuButton extends Component<MenuButtonProps> {
  
  public render() {
    const { text, onClick } = this.props;
    return (
      <div className='menu-button-container'>
        <button type='button' className={classNames('menu-button', {'text-button': !!text})} onClick={onClick}>
          {text ? text : 
            <img src={process.env.PUBLIC_URL + '/icons/chevron-down.svg'} className='icon-chevron-down' alt='Open Menu' />
          }
        </button>
      </div>
    );
  }
}