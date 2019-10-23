import * as React from 'react';
import { find, sortBy } from "lodash";
import { fetchProjects } from "./api";
import Projects from "./Projects";
import ProjectAssets from "./ProjectAssets";
import './App.css';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = { projects: [], activeProject: undefined };
  }

  componentDidMount() {
    this.loadProjects();
  }

  loadProjects = async () => {
    let projects = await fetchProjects();
    projects = sortBy(projects, "name");
    this.setState({ projects, activeProject: projects[0] });
  }

  handleSelectProject = projectId => {
    this.setState({
      activeProject: find(this.state.projects, { id: projectId })
    });
  }

  render() {
    const { projects, activeProject } = this.state;
    return (
      <div className="main">
        <h1 className="header">Abstract Asset Portal</h1>
        <div className="content">
          <Projects
            projects={projects}
            activeProjectId={activeProject ? activeProject.id : undefined}
            onSelectProject={this.handleSelectProject}
          />
          {!!activeProject && (
            <ProjectAssets key={activeProject.id} project={activeProject} />
          )}
        </div>
      </div>
    );
  }
}
