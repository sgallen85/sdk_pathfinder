import { Component } from 'react';
import { GetSDK } from '../mp/GetSDK';
import { MpSdk, Sweep } from '../mp/sdk';
import './App.css';
import Frame from './Frame';
import Menu from './Menu';

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
  private sdk?: MpSdk;
  private sweepData: Sweep.SweepData[] = [];

  constructor(props: any) {
    super(props);
    let queryString = `m=${this.modelId}&applicationKey=${this.apiKey}`;
    queryString += '&title=0&qs=1&hr=0&brand=0&help=0';
    this.src = `/bundle/showcase.html?${queryString}`;
  }

  public async componentDidMount() {
    this.sdk = await GetSDK('showcase', this.apiKey);
    this.sweepData = (await this.sdk.Model.getData()).sweeps;

    this.sdk.Sweep.current.subscribe(currentSweep => {
      this.setState({
        currSweepId: currentSweep.sid,
      });
    });
  }

  private onOptionSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    this.setState({
      selectedSweepId: e.currentTarget.value,
    });
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
