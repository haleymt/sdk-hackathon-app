import * as React from 'react';
import { fetchProjects } from "./api";
import map from "lodash/map";
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
    const projects = this.state.projects || [];
    console.log(projects);
    return (
      <div className="App">
        <header className="App-header">
          <ul>
            {map(projects, project => <li key={project.id}>{project.name}</li>)}
          </ul>
        </header>
      </div>
    );
  }
}
