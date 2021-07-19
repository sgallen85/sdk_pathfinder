import React, { Component } from 'react';

interface Props {
  src: string;
  id?: string;
}

/**
 * This component houses the actual Matterport IFrame element. Doesn't do anything else.
 */
export default class Frame extends Component<Props, {}> {
  render() {
    console.log(this.props.src);
    return (
      <div className='frame'>
        <iframe
          id={this.props.id || 'showcase'}
          className='frame'
          src={this.props.src}
          title={'showcase'}
          width='100%'
          height='90%'
          allowFullScreen={true}
        >
        </iframe>
      </div>
    );
  }
}
