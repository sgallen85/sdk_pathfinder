import { Component } from "react";
import { Sweep } from "../mp/sdk";
import { Dict, distance } from "./utils";

interface MenuProps {
  currSweepId?: string;
  selectedSweepId?: string;
  sweepData: Sweep.SweepData[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

interface OptionsObject {
  element: HTMLOptionElement;
  distance?: number;
}

export default class Menu extends Component<MenuProps> {

  private sweeps: Dict<Sweep.SweepData> = {};

  public componentDidUpdate() {
    this.props.sweepData.map(s => this.sweeps[s.sid] = s);
  }

  private renderOptions() {
    const { currSweepId } = this.props;
    const { sweeps } = this;
    // add new data
    const optionsList: OptionsObject[] = [];
    for (const id of Object.keys(sweeps)) {
        const option = document.createElement('option');
        option.value = option.textContent = id;
        let dist: number | undefined;
        if (currSweepId) {
            const dest = sweeps[id].position;
            dist = distance(sweeps[currSweepId].position, dest);
            option.textContent = option.textContent.concat(` (${Math.round(dist)}m)`)
        }
        optionsList.push({ element: option, distance: dist });
    }
    if (currSweepId) {
        // sort ascending distance
        optionsList.sort((a, b) => {
          if (a.distance && b.distance)
            return a.distance - b.distance;
          return a.element.value.localeCompare(b.element.value);
        });
    }
    return optionsList.map(o => o.element);
  }
  
  public render() {
    const { selectedSweepId, onChange } = this.props;
    return (
      <div className="menu">
        <select onChange={onChange} value={selectedSweepId}>
          <option value=''>--</option>
          {this.renderOptions()}
        </select>
      </div>
    );
  }
}