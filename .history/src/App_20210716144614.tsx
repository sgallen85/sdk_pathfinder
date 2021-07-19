import { Component } from 'react';
import './App.css';
import Showcase from './components/Showcase';

export default class App extends Component {
  public render() {
    return (
      <div className="App">
        <Showcase />
      </div>
    );
  }
}
