import { Component } from 'react';
import { Dictionary, Sweep } from '../mp/sdk';
import './Menu.scss';
import Accordion from './reusables/accordion/Accordion';
import AccordionGroup from './reusables/accordion/AccordionGroup';
import AccordionItem from './reusables/accordion/AccordionItem';
import { distance } from './utils';

interface MenuProps {
  currSweepId?: string;
  selectedSweepId?: string;
  sweepData: Sweep.SweepData[];
  onChange: (e: any) => void;
}

interface MenuState {
  options: OptionsObject[];
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
      options: [],
    };
  }

  public componentDidUpdate(prevProps: MenuProps) {
    // only do if props change
    if (prevProps !== this.props) {
      this.props.sweepData.map(s => this.sweeps[s.sid] = s);
      this.getOptions().then((options) => {
        this.setState({
          options: options,
        });
      });
    }
  }

  private async getOptions() {
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
    return optionsList;
  }

  private renderItem(o: OptionsObject) {
    const { onChange } = this.props;
    return (
      <AccordionItem
        header={o.id}
        body={o.distance ? Math.round(o.distance) + 'm' : undefined}
        onClick={() => onChange(o.id)}
      />
    );
  }

  private renderGroups() {
    const { options } = this.state;
    const groups = [];

    const items = [];
    for (const elt of options) {
      items.push(this.renderItem(elt));
    }

    return (
      <AccordionGroup
        header={`All Sweeps`}
        expanded={true}
      >
        {items}
      </AccordionGroup>
    );
  }
  
  public render() {
    const { options } = this.state;
    return (
      <div className='menu'>
        <Accordion header={`Sweeps (${options.length})`}>
          {this.renderGroups()}
        </Accordion>
      </div>
    );
  }
}