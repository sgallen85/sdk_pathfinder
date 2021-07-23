import { Component } from 'react';
import './ScrubBar.scss';

interface ScrubBarProps {
  onMouseDown: () => void,
  onMouseUp: () => void,
  onChange: (u: number) => void,
  u: any,
}

interface ScrubBarState {
}

export default class ScrubBar extends Component<ScrubBarProps, ScrubBarState> {

  // foo = (x) => {
  //   document.getElementById('control-bar').innerHTML=x
  // }

  public render() {

    const { onMouseDown, onMouseUp, onChange, u } = this.props;
  
    //const path = process.env.PUBLIC_URL + '/icons/')

    return (
      <div className='scrub-bar'>
        <input className='control-bar' id='control-bar' type='range' min='0' max='1' step='0.001' value={u}
          onMouseDown={onMouseDown} 
          onMouseUp={onMouseUp} 
          onChange={(e) => onChange(parseFloat(e.target.value))}
        />
      </div>
    );
  }
}