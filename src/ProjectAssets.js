import * as React from "react";
import { map } from "lodash";
import JSZip from "jszip";
import { saveAs } from 'file-saver';
import { fetchProjectAssets, downloadAsset } from "./api";
import "./projects.css";

export default class ProjectAssets extends React.Component {
  constructor() {
    super();
    this.state = {
      assets: [],
      fetching: true,
      downloading: false,
      downloaded: 0
    };
  }

  componentDidMount() {
    this.loadProjectAssets();
  }

  loadProjectAssets = async () => {
    const assets = await fetchProjectAssets(this.props.project.id);
    this.setState({ assets, fetching: false });
  }

  downloadAsset = async (asset, zip) => {
    const raw = await downloadAsset(asset);

    this.setState(prev => ({
      downloaded: prev.downloading? prev.downloaded + 1 : prev.downloaded,
      downloading: prev.downloading ? prev.downloaded + 1 !== prev.assets.length : false
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
          saveAs(blob, `Assets for ${this.props.project.name}.zip`);
          this.setState({ downloading: false });
        });
    });
  }

  downloadAllAssets = async () => {
    this.setState({ downloaded: 0, downloading: true }, () => {
      this.downloadAndZipAssets(this.state.assets);
    });
  }

  renderEmpty = () => {
    if (this.state.fetching) return <div>Loading assets...</div>;
    return <div>No assets</div>;
  }

  render() {
    const { assets, downloading, downloaded } = this.state;
    const { project } = this.props;
    return (
      <div className="assets">
        <h2>
          <div className="circle" style={{ background: project.color }} />
          {project.name}
          <button
            disabled={!assets.length || downloading}
            onClick={() => this.downloadAllAssets()}
            className="button"
          >
            {downloading
              ? `Downloading ${downloaded + 1} of ${assets.length}...`
              : "Download All"}
          </button>
        </h2>
        {!assets.length ? this.renderEmpty() : (
          <div>
            {map(assets, asset => (
              <div key={asset.id} className="asset">
                Asset for Layer "{asset.layerName}"
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
