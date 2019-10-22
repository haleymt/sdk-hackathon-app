import React from 'react';
import map from "lodash/map";
import Project from "./Project";
import './projects.css';

export default class Projects extends React.Component {
  render() {
    return (
      <div className="projects">
        {map(this.props.projects, project => {
          if (project.name.toLowerCase().includes("web")) {
            return <Project key={project.id} project={project} />;
          }
        })}
      </div>
    )
  }
}
