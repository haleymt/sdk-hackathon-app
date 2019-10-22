import React from 'react';
import map from "lodash/map";
import './projects.css';

export default class Projects extends React.Component {
  renderAssets = (projectId) => {
    const assets = this.props.assets[projectId];
    console.log(assets);
    if (!assets) return null;
    if (!assets.length) return <div>No assets</div>
    return map(assets, asset => (
      <div key={projectId + asset.id} className="asset">
        Asset for Layer "{asset.layerName}"
      </div>
    ))
  }
  render() {
    return (
      <div className="projects">
        {map(this.props.projects, project => (
          <div key={project.id} className="project">
            {project.name}
            <button onClick={() => this.props.onClickProject(project.id)}>
              Fetch Assets
            </button>
            {this.renderAssets(project.id)}
          </div>
        ))}
      </div>
    )
  }
}
