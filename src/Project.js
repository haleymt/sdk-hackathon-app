import * as React from 'react';
import './projects.css';

export default class Project extends React.Component {
  render() {
    const { project, selected, onSelectProject } = this.props;
    const classes = "project" + (selected ? " selected" : "");
    return (
      <button
        type="button"
        key={project.id}
        className={classes}
        onClick={() => onSelectProject(project.id)}
      >
        <div className="circle" style={{ background: project.color }} />
        <strong>{project.name}</strong>
      </button>
    );
  }
}
