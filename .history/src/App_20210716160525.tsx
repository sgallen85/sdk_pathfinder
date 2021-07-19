import { Component } from 'react';
import './App.css';
import { Frame } from './components/Frame';

/**
 * This is the top level class for the app. It handles API key, model ID, and url stuff.
 * Do SDK and UI stuff in other components/files.
 */
export default class App extends Component {
  private apiKey = 'e0iyprwgd7e7mckrhei7bwzza';
  private modelId = 'opSBz3SgMg3';

  private src: string;

  constructor(props: any) {
    super(props);
    let queryString = `m=${this.modelId}&applicationKey=${this.apiKey}`;
    this.src = `./bundle/showcase.html?${queryString}`;
  }

  public render() {
    return (
      <div className="app">
        <Frame src={this.src} />
      </div>
    );
  }
}
