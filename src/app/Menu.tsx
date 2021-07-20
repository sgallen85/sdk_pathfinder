import { Component } from 'react';
import { Sweep } from '../mp/sdk';
import './Menu.scss';
import Accordion from './reusables/accordion/Accordion';
import AccordionGroup from './reusables/accordion/AccordionGroup';
import AccordionItem from './reusables/accordion/AccordionItem';

interface MenuProps {
  currSweepId?: string;
  selectedSweepId?: string;
  sweepData: Sweep.SweepData[];
  onChange: (e: any) => void;
}

interface MenuState {
  sweepGroups: SweepGroups;
}

interface SweepGroups {
  [group: string]: Sweep.SweepData[];
}

/**
 * Component for UI elements like sweep selector, location info, etc.
 */
export default class Menu extends Component<MenuProps, MenuState> {

  constructor(props: any) {
    super(props);
    this.state = {
      sweepGroups: {},
    };
  }

  private getGroups() {
    const { sweepData } = this.props;
    const groups: SweepGroups = {};
    for (const s of sweepData) {
      const floor = '' + s.floor;
      if (!(floor in groups)) {
        groups[floor] = [];
      }
      groups[floor].push(s);
    }
    return groups;
  }

  private renderItem(s: Sweep.SweepData) {
    const { onChange, selectedSweepId } = this.props;
    const { sid } = s;
    return (
      <AccordionItem
        header={sid}
        onClick={() => onChange(sid)}
        selected={sid === selectedSweepId}
      />
    );
  }

  private renderGroups() {
    const sweepGroups = this.getGroups();
    const groups: any = [];

    for (const [group, sweeps] of Object.entries(sweepGroups)) {
      if (!(group in groups)) groups[group] = [];
      
      const items = []
      for (const s of sweeps) {
        items.push(this.renderItem(s));
      }

      groups.push(
        <AccordionGroup
          header={`Floor ${group}`}
          expanded={false}
        >
          {items}
        </AccordionGroup>
      );
    }
    return groups;
  }
  
  public render() {
    const { sweepData } = this.props;
    return (
      <div className='menu'>
        <Accordion header={`Sweeps (${sweepData.length})`}>
          {this.renderGroups()}
        </Accordion>
      </div>
    );
  }
}