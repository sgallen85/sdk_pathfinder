import { Component } from 'react';
import './ScrubBar.scss';

interface ScrubBarProps {
  u: any,
}

interface ScrubBarState {
}

export default class ScrubBar extends Component<ScrubBarProps, ScrubBarState> {

  constructor(props: any) {
    super(props);
  }

  public render() {

    const { u } = this.props;
  
    const path = process.env.PUBLIC_URL + '/icons/';

    return (
      <div className='scrub-bar'>
        <input className='control-bar' type='range' min='0' max='1' step="0.01" value={u}/>
      </div>
    );
  }
}