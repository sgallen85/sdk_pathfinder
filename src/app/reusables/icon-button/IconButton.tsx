import classNames from 'classnames';
import { Component } from 'react';
import './IconButton.scss';
import Icon from '../icon/Icon';

interface IconButtonProps {
  onClick: () => void;
  icon: string;
  classes?: string[]
}

export default class IconButton extends Component<IconButtonProps> {
  public render() {
    const { onClick, icon, classes } = this.props;

    return (
      <div className={classNames('icon-button-container', classes)}>
        <button
          type='button'
          className='icon-button'
          onClick={onClick}
        >
          <Icon icon={icon} />
        </button>
      </div>
    );
  }
}