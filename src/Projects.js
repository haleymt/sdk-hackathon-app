import React from 'react';
import map from "lodash/map";
import Project from "./Project";
import './projects.css';

export default class Projects extends React.Component {
  render() {
    return (
      <div className="projects">
        {map(this.props.projects, project => (
          <Project
            key={project.id}
            project={project}
            selected={project.id === this.props.activeProjectId}
            onSelectProject={this.props.onSelectProject}
          />
        ))}
      </div>
    );
  }
}
