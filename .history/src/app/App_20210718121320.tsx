import { Component } from 'react';
import { GetSDK } from '../mp/GetSDK';
import { Dictionary, MpSdk, Sweep } from '../mp/sdk';
import './App.css';
import Frame from './Frame';
import Menu from './Menu';
import Pathfinder from './Pathfinder';
import { initComponents } from './sdk-components';
import { pathRendererType } from './sdk-components/PathRenderer';
import { sweepIdToPoint } from './utils';

interface Sdk extends MpSdk {
  Scene?: any;
}

interface AppState {
  currSweepId?: string;
  selectedSweepId?: string;
  sweepData: Sweep.SweepData[]; // put in state because changes should trigger rerender
  sweepMap?: Dictionary<MpSdk.Sweep.ObservableSweepData>;
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
  private sdk?: Sdk;

  private pathNode: any; // the node for the PathRenderer component
  private pathfinder?: Pathfinder;

  constructor(props: any) {
    super(props);
    let queryString = `m=${this.modelId}&applicationKey=${this.apiKey}`;
    queryString += '&title=0&qs=1&hr=0&brand=0&help=0&play=1';
    this.src = `/bundle/showcase.html?${queryString}`;

    this.state = {
      sweepData: [],
    };
  }

  public async componentDidMount() {
    this.sdk = await GetSDK('showcase', this.apiKey);
    await initComponents(this.sdk);
    this.sdk.Sweep.data.subscribe({
      onCollectionUpdated: (collection: Dictionary<MpSdk.Sweep.ObservableSweepData>) => {
        this.setState({
          sweepMap: collection
        });
      },
    });
    const sweepData = (await this.sdk.Model.getData()).sweeps;
    this.pathfinder = new Pathfinder(sweepData);

    this.setState({
      sweepData: sweepData,
    });

    this.sdk.Sweep.current.subscribe((currentSweep: any) => {
      this.setState({
        currSweepId: currentSweep.sid,
      });
    });
  }

  private onOptionSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({
      selectedSweepId: e.currentTarget.value,
    }, this.handlePath);
  }

  private async handlePath() {
    const { currSweepId, selectedSweepId, sweepMap } = this.state;
    const { sdk, pathfinder } = this;

    if (sdk && sweepMap && currSweepId && selectedSweepId && pathfinder) {
      const path = pathfinder.findShortestPath(currSweepId, selectedSweepId);
      if (!path) return;
      if (this.pathNode) this.pathNode.stop();
      this.pathNode = await sdk.Scene.createNode();
      this.pathNode.addComponent(pathRendererType, {
        path: path.map(id => sweepIdToPoint(id, sweepMap)),
        opacity: 0.7,
        radius: 0.12,
        stepMultiplier: 10,
        color: 0x8df763,
      });
      this.pathNode.start();
    }
  }

  public render() {

    const { currSweepId, sweepData } = this.state;
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
