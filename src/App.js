import * as React from 'react';
import { fetchProjects } from "./api";
import Projects from "./Projects";
import './App.css';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = { projects: [] };
  }

  componentDidMount() {
    this.loadProjects();
  }

  loadProjects = async () => {
    const projects = await fetchProjects();
    this.setState({ projects });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Projects
            projects={this.state.projects}
          />
        </header>
      </div>
    );
  }
}
