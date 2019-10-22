import * as React from 'react';
import { fetchProjects, fetchProjectAssets } from "./api";
import Projects from "./Projects";
import './App.css';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = { projects: [], assets: {} };
  }

  componentDidMount() {
    this.loadProjects();
  }

  loadProjects = async () => {
    const projects = await fetchProjects();
    this.setState({ projects });
  }

  loadProjectAssets = async projectId => {
    const assets = await fetchProjectAssets(projectId);
    this.setState(prev => ({
      assets: { ...prev.assets, [projectId]: assets }
    }));
  }

  handleClickProject = (projectId) => {
    this.loadProjectAssets(projectId);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Projects
            projects={this.state.projects}
            assets={this.state.assets}
            onClickProject={this.handleClickProject}
          />
        </header>
      </div>
    );
  }
}
