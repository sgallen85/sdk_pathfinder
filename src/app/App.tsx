import React, { Component } from 'react';
import { GetSDK } from '../mp/GetSDK';
import { Dictionary, MpSdk, Sweep } from '../mp/sdk';
import './App.scss';
import Frame from './Frame';
import Menu from './ui/Menu';
import MenuButton from './ui/MenuButton';
import Pathfinder from './Pathfinder';
import Translator from './Translator';
import { initComponents } from './sdk-components';
import { pathRendererType } from './sdk-components/PathRenderer';
import { cameraControllerType } from './sdk-components/CameraController';
import { sweepIdToPoint } from './utils';
import { SweepAlias, sweepAliases } from './sweepAliases';
import ControlsOverlay from './ui/overlay/ControlsOverlay';
import FlyModeButton from './ui/overlay/FlyModeButton';
import ScrubBar from './ui/overlay/ScrubBar';

export interface Sdk extends MpSdk {
  Scene?: any;
}

interface AppState {
  currSweepId?: string;
  selectedSweepId?: string;
  sweepData: Sweep.SweepData[]; // put in state because changes should trigger rerender
  sweepMap?: Dictionary<MpSdk.Sweep.ObservableSweepData>;
  path?: any; // put in state so path visibility updates trigger rerender
  menuEnabled: boolean;
  flyModeEnabled: boolean;
  flyU: number; // integer in [0, 1] indicating position in flythrough
}

const defaultUrlParams: any = {
  m: 'GycExKiYVFp',
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
  private lang: string | null = null;
  private sdk?: Sdk;

  private pathNode: any; // the node for the PathRenderer component
  private pathfinder?: Pathfinder;

  private sweepAlias?: SweepAlias; // human-readable alias for sweeps, if available

  private flyNode: any; // the node for the CameraController component
  private camCon: any; // CameraConroller component

  constructor(props: any) {
    super(props);
    const queryString = this.handleUrlParams();
    this.src = `${process.env.PUBLIC_URL}/bundle/showcase.html?${queryString}`;

    this.state = {
      sweepData: [],
      menuEnabled: true,
      flyModeEnabled: false,
      flyU: 0,
    };
  }

  /**
   * Parses the current url params and combines them with the default params, updating when necessary.
   * @returns url param query string (without `?`), ready to be pasted directly into the url
   */
  private handleUrlParams(): string {
    const params = new URLSearchParams(window.location.search);
    this.lang = params.get('lang');
    for (const [k, v] of Object.entries(defaultUrlParams)) {
      if (!params.has(k)) {
        params.append(k, ''+v); // convert v to string
      }
    }
    return params.toString();
  }

  // --- React methods ---------------------------------------------------------

  public async componentDidMount() {
    
    this.sdk = await GetSDK('showcase', defaultUrlParams.applicationKey);
    await initComponents(this.sdk);

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Add user-generated Mattertags to the default model
    // In production, this block will be removed
    await this.sdk.Model.getData().then( async (data) => {
      if (data.sid === 'GycExKiYVFp') {
        const mattertags = [];
        mattertags.push(
          {
            label: "Revitalizing the Great Hall",
            description: "Within the building’s Great Hall, new vestibule spaces were created to "+
              "connect the main circulation corridor to new restrooms. Elevator lobbies and "+
              "office suite entrances were treated as extensions of the original McKim design, "+
              "with matching marble flooring and wall base, and stained oak millwork-encased "+
              "openings. The installation of fire sprinklers throughout the building helped call "+
              "attention to new opportunities for restoring spatial clarity; obsolete steel and "+
              "wired glass partitions installed in the main corridor in the 1970s were removed, "+
              "opening up the axial hallway to its original extents and further enhancing spatial "+
              "connectivity.",
            anchorPosition: {x: 16.55, y: 1.28-1.5, z: 6.69},
            stemVector: { x: 0, y: 1, z: 0 },
          }
        );
        await this.sdk?.Mattertag.add(mattertags);
      }
    });
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    this.sdk.Model.getData().then( (data) => {
      const sweepData = data.sweeps;
      this.pathfinder = new Pathfinder(sweepData);
      this.setState({
        sweepData: sweepData,
      });
      this.sweepAlias = sweepAliases[data.sid];
    });

    this.sdk.Sweep.data.subscribe({
      onCollectionUpdated: (collection: Dictionary<MpSdk.Sweep.ObservableSweepData>) => {
        this.setState({
          sweepMap: collection
        });
      },
    });

    this.sdk.Sweep.current.subscribe((currentSweep: any) => {
      if (currentSweep.sid) console.log(currentSweep.sid, currentSweep.position);
      this.setState({
        currSweepId: currentSweep.sid,
      });
    });

    // translate all mattertags
    this.translateMattertags();
  }

  public componentDidUpdate(_prevProps: any, prevState: AppState) {
    const { currSweepId, selectedSweepId } = this.state;

    // only update path if sweep state changes
    (currSweepId !== prevState.currSweepId ||
    selectedSweepId !== prevState.selectedSweepId) &&
    this.handlePath();
  }

  // --- SDK methods -----------------------------------------------------------

  private onOptionSelect = (id: string) => {
    this.setState({
      selectedSweepId: id,
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
      this.setState ({
        path: this.pathNode.addComponent(pathRendererType, {
          path: path.map(id => sweepIdToPoint(id, sweepMap)),
          opacity: 0.7,
          radius: 0.12,
          stepMultiplier: 10,
          color: 0x8df763,
        })
      });
      this.pathNode.start();
    }
  }

  private toggleFlyMode = () => {
    this.setState(prevState => {
      if (prevState.flyModeEnabled) {
        this.endFly();
      }
      return {
        flyModeEnabled: !prevState.flyModeEnabled,
      }
    });
  }

  private startFly = async () => {
    const { sdk } = this;
    const { path, flyModeEnabled } = this.state;

    if (sdk && path) {
      if (flyModeEnabled) { // resume current flythrough
        this.resumeFly();
      } else { // start new flythrough
        if (this.flyNode) this.flyNode.stop()
        this.flyNode = await sdk.Scene.createNode();
        this.camCon = this.flyNode.addComponent(cameraControllerType, {
          onChangeU: (u: number) => this.setState({flyU: u}),
        });
        const cam = this.flyNode.addComponent('mp.camera', {
          enabled: true,
        });
        this.camCon.bind('curve', path, 'curve');
        cam.bind('camera', this.camCon, 'camera');
        this.flyNode.start();
        this.setState({flyModeEnabled: true});
        // orient camera to start of flythrough
        const { position, rotation } = this.camCon.getPoseAt(0);
        await sdk.Mode.moveTo(sdk.Mode.Mode.DOLLHOUSE, {
          position,
          rotation: {x: rotation.x*180/Math.PI, y: rotation.y*180/Math.PI},
        });
        // enable flythough
        this.resumeFly();
      }
    }
  }

  private resumeFly = () => {if (this.state.flyModeEnabled) this.camCon.inputs.enabled = true};
  private pauseFly = () => {if (this.state.flyModeEnabled) this.camCon.inputs.enabled = false};
  private setFly = (u: number) => {if (this.state.flyModeEnabled) this.camCon.setManualU(u)};

  private endFly = async () => {
    const { sdk, flyNode } = this;
    if (flyNode) {
      flyNode.stop();
      this.setState({flyModeEnabled: false});
    }
    if (sdk) sdk.Mode.moveTo(sdk.Mode.Mode.INSIDE);
  };

  private toggleMenu = () => {
    this.setState({
      menuEnabled: !this.state.menuEnabled,
    });
  }

  /**
   * TODO: make async to speed up
   */
   private async translateMattertags() {
    const { sdk, lang } = this;

    if (sdk && lang) {
      const Trans = new Translator(lang);
      if (Trans.testQuery()) { // check HTTP request works
        const mattertagData = await sdk.Mattertag.getData();
        for (let i=0; i<mattertagData.length; i++) {
          const { sid, label, description, media } = mattertagData[i];
          const [ newLabel, newDescription ] = Trans.translate([label, description]);
          sdk.Mattertag.editBillboard(sid, {
            label: newLabel, 
            description: newDescription, 
            media,
          });
        }
      }
      Trans.checkUsage();
    }
  }

  // --- Render ----------------------------------------------------------------

  public render() {
    const {
      currSweepId,
      selectedSweepId,
      sweepData,
      menuEnabled,
      flyModeEnabled,
      flyU,
      path,
    } = this.state;

    return (
      <div className='app'>
        <div id='frame-container'>
          <Frame src={this.src} />
          <div id='overlay-container'>
            {/* Put all showcase overlay components here */}
            { path && (
              flyModeEnabled ?
              <ControlsOverlay
              onPlay={this.startFly}
              onPause={this.pauseFly}
              onExit={this.endFly}
            /> : null )}
            { flyModeEnabled && <ScrubBar 
              onMouseDown={this.pauseFly}
              onMouseUp={this.resumeFly}
              onChange={this.setFly}
              u={flyU}
            /> }
          </div>
        </div>
        { !menuEnabled &&
          <MenuButton onClick={this.toggleMenu} />
        }
        { menuEnabled &&
          <Menu
            currSweepId={currSweepId}
            selectedSweepId={selectedSweepId}
            sweepData={sweepData}
            sweepAlias={this.sweepAlias}
            onChange={this.onOptionSelect}
            onClose={this.toggleMenu}
          />
        }
        </div>
    );
  }
}
