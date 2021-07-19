import { Component } from 'react';
import { Dictionary, Sweep } from '../mp/sdk';
import './Menu.css';
import { distance } from './utils';

interface MenuProps {
  currSweepId?: string;
  selectedSweepId?: string;
  sweepData: Sweep.SweepData[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

interface MenuState {
  optionsElements: JSX.Element[];
}

interface OptionsObject {
  id: string;
  distance?: number;
}

/**
 * Component for UI elements like sweep selector, location info, etc.
 */
export default class Menu extends Component<MenuProps, MenuState> {

  private sweeps: Dictionary<Sweep.SweepData> = {}; // more convenient form of sweep data

  constructor(props: any) {
    super(props);
    this.state = {
      optionsElements: [],
    };
  }

  public componentDidUpdate(prevProps: MenuProps) {
    // only do if props change
    if (prevProps !== this.props) {
      this.props.sweepData.map(s => this.sweeps[s.sid] = s);
      this.renderOptions().then((options) => {
        this.setState({
          optionsElements: options,
        });
      });
    }
  }

  private async renderOptions() {
    const { currSweepId } = this.props;
    const { sweeps } = this;
    // add new data
    const optionsList: OptionsObject[] = [];
    for (const id of Object.keys(sweeps)) {
        let dist: number | undefined;
        if (currSweepId) {
            const dest = sweeps[id].position;
            dist = distance(sweeps[currSweepId].position, dest);
        }
        optionsList.push({ id: id, distance: dist });
    }
    // if (currSweepId) {
    //     // sort ascending distance
    //     optionsList.sort((a, b) => {
    //       if (a.distance && b.distance)
    //         return a.distance - b.distance;
    //       return a.id.localeCompare(b.id);
    //     });
    // }
    return optionsList.map(o => {
      return (
        <option key={o.id} value={o.id}>
          {o.id + (o.distance ? ` (${Math.round(o.distance)}m)` : '')}
        </option>
      );
    });
  }
  
  public render() {
    const { selectedSweepId, onChange } = this.props;
    const { optionsElements } = this.state;
    return (
      <div className="menu">
        <select onChange={onChange} value={selectedSweepId}>
          <option value=''>--</option>
          {optionsElements}
        </select>
      </div>
    );
  }
}