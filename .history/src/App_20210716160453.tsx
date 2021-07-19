import { Component } from 'react';
import './App.css';
import { Frame } from './components/Frame';

/**
 * This is the top level class for the app. It handles API key, model ID, and url stuff.
 * Do SDK and UI stuff in other components/files.
 */
export default class App extends Component {
  private apiKey = 'api_key';
  private modelId = 'model_id';

  private src: string;

  constructor(props: any) {
    super(props);
    let queryString = `m=${this.modelId}&applicationKey=${this.apiKey}`;
    this.src = `./bundle/showcase.html?${queryString}`;
  }

  public render() {
    return (
      <div className="app">
        <Frame  />
      </div>
    );
  }
}
