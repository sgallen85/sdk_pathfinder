import React, { Component } from 'react';
import './Frame.scss';

interface Props {
  src: string;
  id?: string;
  customRef?: React.RefObject<HTMLIFrameElement>
}

/**
 * This component houses the actual Matterport IFrame element. Doesn't do anything else.
 */
export default class Frame extends Component<Props, {}> {
  render() {
    const { src, id, customRef } = this.props;
    return (
      <div className='frame'>
        <iframe
          id={id || 'showcase'}
          className='frame'
          src={src}
          title={'showcase'}
          allowFullScreen={true}
          frameBorder='0'
          ref={customRef}
        >
        </iframe>
      </div>
    );
  }
}
