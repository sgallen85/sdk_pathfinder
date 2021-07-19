import React, { Component } from 'react';
import './Frame.css';

interface Props {
  src: string;
  id?: string;
}

/**
 * This component houses the actual Matterport IFrame element. Doesn't do anything else.
 */
export default class Frame extends Component<Props, {}> {
  render() {
    return (
      <div className='frame'>
        <iframe
          id={this.props.id || 'showcase'}
          className='frame'
          src={this.props.src}
          title={'showcase'}
          allowFullScreen={true}
          frameBorder='0'
        >
        </iframe>
      </div>
    );
  }
}
