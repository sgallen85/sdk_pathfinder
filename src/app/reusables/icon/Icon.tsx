import { Component } from 'react';
import './Icon.scss';
import classNames from 'classnames';

interface IconProps {
  icon: string;
  classes?: string | string[];
}

export default class Icon extends Component<IconProps> {
  public render() {
    const { icon, classes } = this.props;
    let classArray: string[] = [];
    if (classes) {
      if (Array.isArray(classes)) {
        classArray = classes;
      } else {
        classArray = [classes];
      }
    }

    return (
      <span className={classNames('icon', 'icon-' + icon, ...classArray)} />
    );
  }
}