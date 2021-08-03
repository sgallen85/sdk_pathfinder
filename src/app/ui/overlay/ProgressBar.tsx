import React, { Component } from 'react';
import { clamp } from '../../utils';
import './ProgressBar.scss';

const PROGRESS_BAR_THUMB_SIZE = '14px';

interface ProgressBarProps {
  min: number;
  max: number;
  initValue?: number;
  overrideValue?: number;
  scrub?: boolean;
  step?: number;
  noThumb?: boolean;
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
   * @returns Clamped value based on min/max, or current value iff ref is undefined.
   */
  private calculate(mx: number): number {
    const { min, max } = this.props;
    const { value } = this.state;
    const track = this.trackRef.current;
    if (!track) return value;

    const rect = track.getBoundingClientRect();
    const dx = mx - rect.left;
    const total = rect.right - rect.left;
    const frac = dx / total;
    const range = max - min;
    
    return clamp(frac * range, min, max);
  }

  private onMouseDown = (e: any) => {
    const { onMouseDown, onChange } = this.props;
    const ev = e as MouseEvent;
    if (ev.button !== 0) return;

    const value = this.calculate(ev.clientX);
    onMouseDown?.(value);
    onChange?.(value);
    this.setState({ value: value, mouseDown: true });
  }

  private onMouseUp = (e: any) => {
    const { onMouseUp } = this.props;
    const { value, mouseDown, } = this.state;
    const ev = e as MouseEvent;
    if (ev.button !== 0) return;

    if (mouseDown) {
      onMouseUp?.(value);
    }
    this.setState({ mouseDown: false });
  }

  private onMouseMove = (e: any) => {
    const { scrub, onChange, } = this.props;
    const { mouseDown } = this.state;
    if (!scrub || !mouseDown) return;

    const ev = e as MouseEvent;
    const value = this.calculate(ev.clientX);
    this.setState({ value: value }, () => onChange?.(value))
  }

  public render() {
    const {
      min,
      max,
      overrideValue,
      noThumb,
    } = this.props;
    const {
      value,
      mouseDown
    } = this.state;

    const frac = (overrideValue || value) / (max - min);
    const percent = frac * 100;

    return (
      <div className='progress-bar-container'>
        <div className='progress-bar-track-container'>
          <div
            className='progress-bar-track'
            onMouseDown={this.onMouseDown}
            ref={this.trackRef}
          >
            <div
              className='progress-bar-progress'
              style={{
                width: `${percent}%`
              }}
            ></div>
          </div>
        </div>
        { !noThumb &&
          <div
            className='progress-bar-thumb'
            style={{
              width: PROGRESS_BAR_THUMB_SIZE,
              height: PROGRESS_BAR_THUMB_SIZE,
              left: `calc(${percent}% - (${PROGRESS_BAR_THUMB_SIZE}/2))`,
            }}
            onMouseDown={this.onMouseDown}
          ></div>
        }
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