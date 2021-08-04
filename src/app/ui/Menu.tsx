import { Component } from 'react';
import { Dictionary, MpSdk, Sweep } from '../../mp/sdk';
import './Menu.scss';
import Accordion from '../reusables/accordion/Accordion';
import AccordionGroup from '../reusables/accordion/AccordionGroup';
import AccordionItem from '../reusables/accordion/AccordionItem';
import { SweepAlias } from '../sweepAliases';
import Icon from '../reusables/icon/Icon';
import MenuNudge from './MenuNudge';
import { LanguageOptions, loc } from '../Localization';

interface MenuProps {
  lang: string;
  currSweepId?: string;
  selectedSweepId?: string;
  sweepData: Sweep.SweepData[];
  sweepAlias?: SweepAlias;
  floorMap?: Dictionary<MpSdk.Floor.FloorData>;
  onChange: (e: any) => void;
  onClose: () => void;
  onChangeLang: (e: any) => void;
}

interface MenuState {
  sweepGroups: SweepGroups;
  displayNudge: boolean;
}

interface SweepGroups {
  [group: string]: Sweep.SweepData[];
}

/**
 * Time (ms) until nudge displays
 */
const MENU_NUDGE_TIMEOUT = 2000;
/**
 * Key name for browser storage of whether nudge has been seen (close button clicked)
 */
const MENU_NUDGE_SEEN_KEY = 'menu_nudge_seen';

/**
 * Component for UI elements like sweep selector, location info, etc.
 */
export default class Menu extends Component<MenuProps, MenuState> {

  constructor(props: any) {
    super(props);
    this.state = {
      sweepGroups: {},
      displayNudge: false,
    };    
  }

  public componentDidMount() {
    const nudgeSeen = sessionStorage.getItem(MENU_NUDGE_SEEN_KEY);
    if (!nudgeSeen || nudgeSeen === 'false') {
      window.setTimeout(() => {
        this.setState({
          displayNudge: true,
        });
      }, MENU_NUDGE_TIMEOUT);
    }
  }

  private onCloseNudge = () => {
    sessionStorage.setItem(MENU_NUDGE_SEEN_KEY, 'true');
    this.setState({
      displayNudge: false,
    });
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
    const { lang, onChange, selectedSweepId, sweepAlias } = this.props;
    const { sid } = s;
    const name = sweepAlias ? loc(sweepAlias[sid], lang) : sid; // replace sid with alias, if available
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
    const { lang, selectedSweepId, floorMap } = this.props;
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
        (floorSequence !== undefined && `${loc('Floor', lang)} ${floorSequence+1}`) ||
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

  public renderLanguageSelect() {
    const langOptions = [];
    for (const {code, text} of Object.values(LanguageOptions)) {
      langOptions.push(<option value={code}>{text}</option>);
    }
    return (
      <div style={{ marginLeft: 'auto' }}>
        <select
          onChange={this.props.onChangeLang}
        >
          {langOptions}
        </select>
      </div>
    );
  }
  
  public render() {
    const { lang, onClose } = this.props;
    const { displayNudge } = this.state;
    return (
      <div className='menu'>
        <div className='menu-header'>
          <div className='menu-header-text header-font'>{loc('Locations', lang)}</div>
          {this.renderLanguageSelect()}
          <button type='button' className='menu-close-button' onClick={onClose}>
            <Icon icon='close' />
          </button>
        </div>
        <Accordion>
          {this.renderGroups()}
        </Accordion>
        { displayNudge &&
          <MenuNudge
            text={loc('nudge_text', lang)}
            closeText={loc('CLOSE', lang)}
            onClose={this.onCloseNudge}
          />
        }
      </div>
    );
  }
}