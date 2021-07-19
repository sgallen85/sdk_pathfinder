import React, { Component } from "react";

export default class Showcase extends Component {
  private iframeRef: React.RefObject<HTMLIFrameElement>;

  constructor(props: any) {
    super(props);
    this.iframeRef = React.createRef();
  }

  public render() {
    return (
      <div className={'showcase'}>
        <iframe 
          id={'showcase'}
          width={'100%'}
          height={'90%'}
          frameBorder={0}
          allowFullScreen={true}
          ref={this.iframeRef}
        >
    </iframe>
      </div>
    );
  }
}