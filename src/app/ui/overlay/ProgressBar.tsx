import React, { Component } from 'react';
import { clamp } from '../../utils';
import './ProgressBar.scss';

interface ProgressBarProps {
  min: number;
  max: number;
  initValue?: number;
  overrideValue?: number;
  scrub?: boolean;
  step?: number;
  onMouseDown?: (value: number) => void;
  onMouseUp?: (value: number) => void;
  onChange?: (value: number) => void;
}

interface ProgressBarState {
  value: number; // will always match overrideValue when passed around (see componentdidUpdate)
  mouseDown: boolean;
}

export default class ProgressBar extends Component<ProgressBarProps, ProgressBarState> {
  
  private abortController = new AbortController();
  private trackRef = React.createRef<HTMLDivElement>();

  constructor(props: ProgressBarProps) {
    super(props);
    const { initValue } = props;
    
    this.state = {
      value: initValue || 0,
      mouseDown: false,
    }
  }
  
  public componentDidMount() {
    window.addEventListener(
      'mouseup',
      this.onMouseUp,
      { signal: this.abortController.signal } as AddEventListenerOptions
    );
    window.addEventListener(
      'mousemove',
      this.onMouseMove,
      { signal: this.abortController.signal } as AddEventListenerOptions
    );
  }

  public componentWillUnmount() {
    this.abortController.abort();
  }

  public componentDidUpdate(prevProps: ProgressBarProps, prevState: ProgressBarState) {
    if (prevProps.overrideValue !== prevState.value && this.props.overrideValue) {
      this.setState({ value: this.props.overrideValue });
    }
  }

  /**
   * Calculates value of progress bar from mouse position.
   * @param mx Mouse X position.
   * @returns Clamped value based on min/max, or undefined iff ref is undefined.
   */
  private calculate(mx: number): number | undefined {
    const { min, max } = this.props;
    const track = this.trackRef.current;
    if (!track) return;

    const rect = track.getBoundingClientRect();
    const dx = mx - rect.left;
    const total = rect.right - rect.left;
    const frac = dx / total;
    const range = max - min;
    
    return clamp(frac * range, min, max);
  }

  private onMouseDown = (e: any) => {
    const { onMouseDown, onChange } = this.props;
    
    const value = this.calculate((e as MouseEvent).clientX);
    if (!value) return;
    onMouseDown?.(value);
    onChange?.(value);
    this.setState({ value: value, mouseDown: true });
  }

  private onMouseUp = (e: any) => {
    const { onMouseUp } = this.props;
    const { value, mouseDown, } = this.state;

    if (mouseDown) {
      onMouseUp?.(value);
    }
    this.setState({ mouseDown: false });
  }

  private onMouseMove = (e: any) => {
    const { scrub, onChange, } = this.props;
    const { mouseDown } = this.state;
    if (!scrub || !mouseDown) return;
    
    const value = this.calculate((e as MouseEvent).clientX);
    if (value === undefined) return;
    this.setState({ value: value }, () => onChange?.(value))
  }

  public render() {
    const {
      min,
      max,
      overrideValue,
    } = this.props;
    const {
      value,
      mouseDown
    } = this.state;

    const frac = (overrideValue || value) / (max - min);

    return (
      <div className='progress-bar-container'>
        <div
          className='progress-bar-track'
          onMouseDown={this.onMouseDown}
          ref={this.trackRef}
        >
          <div
            className='progress-bar-progress'
            style={{
              width: `${frac*100}%`
            }}
          ></div>
        </div>
        {/* Needed so mousemove fires even when over the {pointer-events: none} canvas */}
        <div className='pointer-event-overlay'
          style={{
            position: 'fixed',
            inset: '0',
            pointerEvents: 'all',
            display: mouseDown ? 'block' : 'none',
          }}
        ></div>
      </div>
    );
  }
}