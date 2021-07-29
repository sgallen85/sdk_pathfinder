import { Component } from 'react';
import { Dictionary, MpSdk, Sweep } from '../../mp/sdk';
import './Menu.scss';
import Accordion from '../reusables/accordion/Accordion';
import AccordionGroup from '../reusables/accordion/AccordionGroup';
import AccordionItem from '../reusables/accordion/AccordionItem';
import { SweepAlias } from '../sweepAliases';
import Icon from '../reusables/icon/Icon';

interface MenuProps {
  currSweepId?: string;
  selectedSweepId?: string;
  sweepData: Sweep.SweepData[];
  sweepAlias?: SweepAlias;
  floorMap?: Dictionary<MpSdk.Floor.FloorData>;
  onChange: (e: any) => void;
  onClose?: () => void;
  onChangeLang: (e: any) => void;
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
        key={sid}
      />
    );
  }

  /**
   * Renders sweeps grouped by floors.
   * @returns List of `<AccordionGroup>` with items inside.
   */
  private renderGroups() {
    const { selectedSweepId, floorMap } = this.props;
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

      const floorName = floorMap?.[floor]?.name;
      const floorSequence = floorMap?.[floor]?.sequence;

      // use floor name, 1-indexed sequence, id in that order of priority
      const header = floorName ||
        (floorSequence !== undefined && `Floor ${floorSequence+1}`) ||
        floor;

      floors.push(
        <AccordionGroup
          header={header}
          expanded={!!selectedFloor && ''+selectedFloor === floor}
          showNumber={true}
          key={floor}
        >
          {items}
        </AccordionGroup>
      );
    }
    return floors;
  }
  
  public render() {
    const { onClose, onChangeLang } = this.props;
    return (
      <div className='menu'>
        <div className='menu-header'>
          <div className='menu-header-text header-font'>Sweeps</div>
          { onClose &&
            <button type='button' className='menu-close-button' onClick={onClose}>
              <Icon icon='close' />
            </button>
          }
        </div>
        <Accordion>
          {this.renderGroups()}
        </Accordion>
        <div>
          <select 
            onChange={onChangeLang}>
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
            <option value="ru">Русский</option>
            <option value="zh">中文</option>
            <option value="ja">日本語</option>
            <option value="nl">Nederlands</option>
            <option value="it">Italiano</option>
            <option value="pt">Português</option>
          </select>
        </div>
      </div>
    );
  }
}