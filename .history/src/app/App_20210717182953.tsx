import { Component } from 'react';
import { GetSDK } from '../mp/GetSDK';
import { MpSdk, Sweep } from '../mp/sdk';
import './App.css';
import Frame from './Frame';
import Menu from './Menu';
import Pathfinder from './Pathfinder';
import { initComponents } from './sdk-components';
import { pathRendererType } from './sdk-components/PathRenderer';

interface AppState {
  currSweepId?: string;
  selectedSweepId?: string;
}

/**
 * This is the top level class for the app. It handles API key, model ID, and url stuff,
 * and holds references to objects/modules/components for object composition.
 * Do non-initializing SDK and UI stuff in other components/files.
 */
export default class App extends Component<{}, AppState> {
  private apiKey = 'e0iyprwgd7e7mckrhei7bwzza';
  private modelId = 'opSBz3SgMg3';

  private src: string; // the url source for the sdk
  private sdk?: MpSdk | any;
  private sweepData: Sweep.SweepData[] = [];

  private pathNode: any; // the node for the PathRenderer component
  private pathfinder?: Pathfinder;

  constructor(props: any) {
    super(props);
    let queryString = `m=${this.modelId}&applicationKey=${this.apiKey}`;
    queryString += '&title=0&qs=1&hr=0&brand=0&help=0';
    this.src = `/bundle/showcase.html?${queryString}`;
  }

  public async componentDidMount() {
    this.sdk = await GetSDK('showcase', this.apiKey);
    await initComponents(this.sdk);
    this.sweepData = (await this.sdk.Model.getData()).sweeps;
    this.pathfinder = new Pathfinder(this.sweepData);

    this.sdk.Sweep.current.subscribe((currentSweep: Sweep.SweepData) => {
      this.setState({
        currSweepId: currentSweep.sid,
      });
    });
  }

  private onOptionSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    this.setState({
      selectedSweepId: e.currentTarget.value,
    }, this.handlePath);
  }

  private async handlePath() {
    const { currSweepId, selectedSweepId } = this.state;
    const { sdk, pathNode, pathfinder } = this;

    if (sdk && currSweepId && selectedSweepId && pathfinder) {
      const path = pathfinder.findShortestPath(currSweepId, selectedSweepId);
      if (!path) return;
      if (pathNode) pathNode.stop();
      this.pathNode = await sdk.Scene.createNode();
      pathNode.addComponent(pathRendererType, {
        path: path,
        opacity: 0.7,
        radius: 0.12,
        stepMultiplier: 10,
        color: 0x8df763,
      });
    }
  }

  public render() {

    const { currSweepId } = this.state;
    const { sweepData } = this;
    return (
      <div className='app'>
        <Frame src={this.src} />
        <Menu
          currSweepId={currSweepId}
          sweepData={sweepData}
          onChange={this.onOptionSelect}
        />
      </div>
    );
  }
}