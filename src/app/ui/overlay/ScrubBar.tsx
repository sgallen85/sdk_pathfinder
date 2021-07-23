import { Component } from 'react';
import './ScrubBar.scss';

interface ScrubBarProps {
  onMouseDown: () => void,
  onMouseUp: () => void,
  onChange: (e: any) => void,
  u: any,
}

interface ScrubBarState {
}

export default class ScrubBar extends Component<ScrubBarProps, ScrubBarState> {

  public render() {

    const { onMouseDown, onMouseUp, onChange, u } = this.props;
  
    //const path = process.env.PUBLIC_URL + '/icons/')

    return (
      <div className='scrub-div'>
        <input className='scrub-bar' type='range' min='0' max='1' step='0.001' value={u}
          onMouseDown={onMouseDown} 
          onMouseUp={onMouseUp} 
          onChange={onChange}
        />
      </div>
    );
  }
}