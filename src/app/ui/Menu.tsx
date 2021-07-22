import { Component } from 'react';
import { Sweep } from '../../mp/sdk';
import './Menu.scss';
import Accordion from '../reusables/accordion/Accordion';
import AccordionGroup from '../reusables/accordion/AccordionGroup';
import AccordionItem from '../reusables/accordion/AccordionItem';
import { SweepAlias } from '../sweepAliases';

interface MenuProps {
  currSweepId?: string;
  selectedSweepId?: string;
  sweepData: Sweep.SweepData[];
  sweepAlias?: SweepAlias;
  onChange: (e: any) => void;
  onClose?: () => void;
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
    const { sweepData, sweepAlias } = this.props;
    const groups: SweepGroups = {};
    for (const s of sweepData) {
      if (sweepAlias && !(s.sid in sweepAlias)) continue; // skip sweeps without alias, if available
      const floor = '' + s.floor;
      if (!(floor in groups)) {
        groups[floor] = [];
      }
      groups[floor].push(s);
    }
    return groups;
  }

  private renderItem(s: Sweep.SweepData) {
    const { onChange, selectedSweepId, sweepAlias } = this.props;
    const { sid } = s;
    const name = sweepAlias ? sweepAlias[sid] : sid; // replace sid with alias, if available
    return (
      <AccordionItem
        header={name}
        onClick={() => onChange(sid)}
        selected={sid === selectedSweepId}
      />
    );
  }

  /**
   * Renders sweeps grouped by floors.
   * @returns List of `<AccordionGroup>` with items inside.
   */
  private renderGroups() {
    const { selectedSweepId } = this.props;
    const sweepGroups = this.getGroups();
    const floors: any = [];
    let selectedFloor = undefined;

    for (const [floor, sweeps] of Object.entries(sweepGroups)) {
      if (!(floor in floors)) floors[floor] = [];
      
      const items = []
      for (const s of sweeps) {
        items.push(this.renderItem(s));
        if (s.sid === selectedSweepId) {
          selectedFloor = s.floor;
        }
      }

      floors.push(
        <AccordionGroup
          header={`Floor ${floor}`}
          expanded={!!selectedFloor && ''+selectedFloor === floor}
        >
          {items}
        </AccordionGroup>
      );
    }
    return floors;
  }
  
  public render() {
    const { sweepData, onClose } = this.props;
    return (
      <div className='menu'>
        <div className='menu-header'>
          <div className='menu-header-text'>{`Sweeps (${sweepData.length})`}</div>
          { onClose &&
            <button type='button' className='menu-close-button' onClick={onClose}>
              <img src={process.env.PUBLIC_URL + '/icons/x-lg.svg'} className=' icon-x-lg' alt='Close' />
            </button>
          }
        </div>
        <Accordion>
          {this.renderGroups()}
        </Accordion>
      </div>
    );
  }
}