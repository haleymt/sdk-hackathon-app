import React from 'react';
import { map, forEach } from "lodash";
import { fetchProjectAssets, downloadAsset } from "./api";
import './projects.css';

export default class Project extends React.Component {
  constructor() {
    super();
    this.state = {
      assets: [],
      fetching: false,
      hasFetched: false,
      downloading: false,
      downloaded: 0
    }
  }

  loadProjectAssets = async () => {
    this.setState({ fetching: true });
    const assets = await fetchProjectAssets(this.props.project.id);
    this.setState({ assets, fetching: false, hasFetched: true });
  }

  downloadAsset = async asset => {
    await downloadAsset(asset);
    this.setState(prev => ({
      downloaded: prev.downloaded + 1,
      downloading: prev.downloaded + 1 !== prev.state.assets.length
    }));
  }

  fetchAndDownloadAssets = async () => {
    if (!this.state.hasFetched) {
      this.setState({ fetching: true });
      const assets = await fetchProjectAssets(this.props.project.id);
      this.setState({
        assets,
        fetching: false,
        hasFetched: true,
        downloading: !!assets.length
      }, () => {
        forEach(assets, asset => this.downloadAsset(asset));
      });
    } else {
      this.setState({ downloading: true }, () => {
        forEach(this.state.assets, asset => this.downloadAsset(asset));
      });
    }
  }

  renderAssets = () => {
    const { assets, hasFetched, fetching, downloading, downloaded } = this.state;
    if (!fetching && !hasFetched) return null;
    if (fetching) return <div>Fetching...</div>
    if (!assets.length && hasFetched) return <div>No assets</div>
    return (
      <div>
        {downloading && (
          <div>Downloading {downloaded + 1} of {assets.length}...</div>
        )}
        {map(assets, asset => (
          <div key={this.props.project.id + asset.id} className="asset">
            Asset for Layer "{asset.layerName}"
            <button onClick={() => this.downloadAsset(asset)}>
              Download
            </button>
          </div>
        ))}
      </div>
    );
  }

  render() {
    const { project } = this.props;
    return (
      <div key={project.id} className="project">
        <strong>{project.name}</strong>
        <button onClick={() => this.loadProjectAssets()}>
          Fetch Assets
        </button>
        <button onClick={() => this.fetchAndDownloadAssets()}>
          Download Assets
        </button>
        {this.renderAssets(project.id)}
      </div>
    );
  }
}
