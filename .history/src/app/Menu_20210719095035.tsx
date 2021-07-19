import { Component } from "react";
import { Dictionary, Sweep } from "../mp/sdk";
import { distance } from "./utils";

interface MenuProps {
  currSweepId?: string;
  selectedSweepId?: string;
  sweepData: Sweep.SweepData[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

interface OptionsObject {
  id: string;
  distance?: number;
}

export default class Menu extends Component<MenuProps> {

  private sweeps: Dictionary<Sweep.SweepData> = {}; // more convenient form of sweep data

  public componentDidUpdate() {
    this.props.sweepData.map(s => this.sweeps[s.sid] = s);
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