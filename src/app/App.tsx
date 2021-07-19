import { Component } from 'react';
import { GetSDK } from '../mp/GetSDK';
import { Dictionary, MpSdk, Sweep } from '../mp/sdk';
import './App.css';
import Frame from './Frame';
import Menu from './Menu';
import Pathfinder from './Pathfinder';
import { initComponents } from './sdk-components';
import { pathRendererType } from './sdk-components/PathRenderer';
import { cameraControllerType } from './sdk-components/CameraController';
import { sweepIdToPoint } from './utils';

export interface Sdk extends MpSdk {
  Scene?: any;
}

interface AppState {
  currSweepId?: string;
  selectedSweepId?: string;
  sweepData: Sweep.SweepData[]; // put in state because changes should trigger rerender
  sweepMap?: Dictionary<MpSdk.Sweep.ObservableSweepData>;
}

const defaultUrlParams: any = {
  m: 'opSBz3SgMg3',
  applicationKey: 'q44m20q8yk81yi0qgixrremda',
  title: '0',
  qs: '1',
  hr: '0',
  brand: '0',
  help: '0',
  play: '1',
}

/**
 * This is the top level class for the app. It handles API key, model ID, and url stuff,
 * and holds references to objects/modules/components for object composition.
 * Do non-initializing SDK and UI stuff in other components/files.
 */
export default class App extends Component<{}, AppState> {


  private src: string; // the url source for the sdk
  private sdk?: Sdk;

  private pathNode: any; // the node for the PathRenderer component
  private path: any; // PathRenderer component. Needed for CameraController.
  private pathfinder?: Pathfinder;

  private flyNode: any; // the node for the CameraController component

  constructor(props: any) {
    super(props);
    const queryString = this.handleUrlParams();
    this.src = `${process.env.PUBLIC_URL}/bundle/showcase.html?${queryString}`;

    this.state = {
      sweepData: [],
    };
  }

  private handleUrlParams(): string {
    const params = new URLSearchParams(window.location.search);
    for (const [k, v] of Object.entries(defaultUrlParams)) {
      if (!params.has(k)) {
        params.append(k, ''+v); // convert v to string
      }
    }
    return params.toString();
  }

  public async componentDidMount() {
<<<<<<< HEAD
    this.sdk = await GetSDK('showcase', defaultUrlParams.applicationKey);
=======

    this.sdk = await GetSDK('showcase', this.apiKey);
>>>>>>> 08bc26a (Implement fly through feature)
    await initComponents(this.sdk);

    const sweepData = (await this.sdk.Model.getData()).sweeps;
    this.pathfinder = new Pathfinder(sweepData);
    this.setState({
      sweepData: sweepData,
    });

    this.sdk.Sweep.data.subscribe({
      onCollectionUpdated: (collection: Dictionary<MpSdk.Sweep.ObservableSweepData>) => {
        this.setState({
          sweepMap: collection
        });
      },
    });

    this.sdk.Sweep.current.subscribe((currentSweep: any) => {
      this.setState({
        currSweepId: currentSweep.sid,
      });
    });
  }

  componentDidUpdate() {
    this.handlePath();
  }

  private onOptionSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({
      selectedSweepId: e.currentTarget.value,
    });
  }

  private async handlePath() {
    const { currSweepId, selectedSweepId, sweepMap } = this.state;
    const { sdk, pathfinder } = this;

    if (sdk && sweepMap && currSweepId && selectedSweepId && pathfinder) {
      const path = await pathfinder.findShortestPath(currSweepId, selectedSweepId);
      if (!path) return;
      if (this.pathNode) this.pathNode.stop();
      this.pathNode = await sdk.Scene.createNode();
      this.path = this.pathNode.addComponent(pathRendererType, {
        path: path.map(id => sweepIdToPoint(id, sweepMap)),
        opacity: 0.7,
        radius: 0.12,
        stepMultiplier: 10,
        color: 0x8df763,
      });
      this.pathNode.start();
    }
  }

  private async startFly() {
    const { sdk, path } = this;

    if (sdk && path) {
        this.endFly();
        this.flyNode = await sdk.Scene.createNode();
        const camCon = await this.flyNode.addComponent(cameraControllerType);
        const cam = this.flyNode.addComponent('mp.camera', {
            enabled: true,
        });
        camCon.bind('curve', path, 'curve');
        cam.bind('camera', camCon, 'camera');
        await sdk.Mode.moveTo(sdk.Mode.Mode.DOLLHOUSE, {
          transition: sdk.Mode.TransitionType.INSTANT,
        });
        this.flyNode.start();
    }
  }

  private async endFly() {
    const { sdk, flyNode } = this;
    if (sdk && flyNode) {
      flyNode.stop();
      //await sdk.Mode.moveTo(sdk.Mode.Mode.INSIDE);
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
        <button onClick={() => this.startFly()}>Start Fly</button>
        <button onClick={() => this.endFly()}>End Fly</button>
      </div>
    );
  }
}
