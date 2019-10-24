import * as React from "react";
import { map, sortBy } from "lodash";
import JSZip from "jszip";
import { saveAs } from 'file-saver';
import { fetchProjectAssets, fetchProjectBranches, downloadAsset } from "./api";
import "./projects.css";

export default class ProjectAssets extends React.Component {
  constructor() {
    super();
    this.state = {
      assets: { master: [] },
      branches: [{ id: "master", name: "Master" }],
      branchId: "master",
      fetching: true,
      fetchingBranches: true,
      downloading: false,
      downloaded: 0
    };
  }

  componentDidMount() {
    this.loadProjectAssets(this.state.branchId);
    this.loadProjectBranches();
  }

  loadProjectAssets = async branchId => {
    if (this.state.assets[branchId] && this.state.assets[branchId].length) {
      return;
    }

    const assets = await fetchProjectAssets(this.props.project.id, branchId);
    this.setState(prev => ({
      assets: { ...prev.assets, [branchId]: assets },
      fetching: false
    }));
  }

  loadProjectBranches = async () => {
    const branches = await fetchProjectBranches(this.props.project.id);
    this.setState({
      branches: sortBy(branches, "name"),
      fetchingBranches: false
    });
  }

  downloadAsset = async (asset, zip) => {
    const raw = await downloadAsset(asset);

    this.setState(prev => ({
      downloaded: prev.downloading ? prev.downloaded + 1 : prev.downloaded
    }));

    if (zip) {
      zip.file(asset.id + "." + asset.fileFormat, raw, { base64: true });
    }
  }

  downloadAndZipAssets = async assets => {
    let zip = new JSZip();
    let p = [];

    assets.forEach(asset => p.push(this.downloadAsset(asset, zip)));

    Promise.all(p).then(() => {
      zip
        .generateAsync({ type: "blob" })
        .then((blob) => {
          saveAs(
            blob,
            `Asset${assets.length > 1 ? "s" : ""} for ${this.props.project.name}.zip`
          );
          this.setState({ downloading: false });
        });
    });
  }

  downloadAllAssets = async () => {
    this.setState({ downloaded: 0, downloading: true }, () => {
      this.downloadAndZipAssets(this.state.assets[this.state.branchId] || []);
    });
  }

  handleBranchChange = event => {
    const branchId = event.target.value;
    this.setState({ branchId, fetching: true }, () => {
      this.loadProjectAssets(branchId);
    });
  }

  renderEmpty = () => {
    if (this.state.fetching) return <div>Loading assets...</div>;
    return <div>No assets</div>;
  }

  render() {
    const { assets, branches, branchId, downloading, downloaded } = this.state;
    const { project } = this.props;
    const branchAssets = assets[branchId];
    return (
      <div className="assets">
        <h2>
          <div className="circle" style={{ background: project.color }} />
          {project.name}
          <button
            disabled={!branchAssets || !branchAssets.length || downloading}
            onClick={() => this.downloadAllAssets()}
            className="button"
          >
            {downloading
              ? `Downloading ${downloaded + 1} of ${branchAssets.length}...`
              : "Download All"}
          </button>
          <select
            className="button select"
            value={branchId}
            onChange={this.handleBranchChange}
            disabled={this.state.fetchingBranches}
          >
            {map(branches, branch => (
              <option key={branch.id} value={branch.id}>{branch.name}</option>
            ))}
          </select>
        </h2>
        {!branchAssets || !branchAssets.length ? this.renderEmpty() : (
          <div>
            {map(branchAssets, asset => (
              <div key={asset.id} className="asset">
                Asset for Layer <strong>{asset.layerName}</strong>
                <button
                  onClick={() => this.downloadAndZipAssets([asset])}
                  className="button"
                >
                  Download
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }
}
