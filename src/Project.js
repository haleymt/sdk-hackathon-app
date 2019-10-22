import * as React from 'react';
import { map } from "lodash";
import JSZip from "jszip";
import fs from "fs";
import { saveAs } from 'file-saver';
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

  downloadAsset = async (asset, zip) => {
    const raw = await downloadAsset(asset);
    this.setState(prev => ({
      downloaded: prev.downloaded + 1,
      downloading: prev.downloading ? prev.downloaded + 1 !== prev.assets.length : false
    }));

    if (zip) {
      zip.file(asset.id + "." + asset.fileFormat, raw, {
        base64: true
      });
    }
  }

  downloadAndZipAssets = async assets => {
    let zip = new JSZip();
    let p = [];
    assets.forEach(asset => {
      p.push(this.downloadAsset(asset, zip));
    });

    Promise.all(p).then(() => {
      zip
        .generateAsync({ type:"blob" })
        .then((blob) => saveAs(blob, `Assets for ${this.props.project.name}.zip`));
        // .generateNodeStream({ type: "nodebuffer", streamFiles: true })
        // .pipe(fs.createWriteStream("out.zip"))
        // .on("finish", function() {
        //   // JSZip generates a readable stream with a "end" event,
        //   // but is piped here in a writable stream which emits a "finish" event.
        //   console.log("out.zip written.");
        // });
    });
  }

  fetchAndDownloadAssets = async () => {
    if (!this.state.hasFetched) {
      this.setState({ fetching: true });
      const assets = await fetchProjectAssets(this.props.project.id);
      this.setState({
        assets,
        fetching: false,
        hasFetched: true,
        downloading: !!assets.length,
        downloaded: 0
      }, () => this.downloadAndZipAssets(assets));
    } else {
      this.setState({ downloaded: 0, downloading: true }, () => {
        this.downloadAndZipAssets(this.state.assets);
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
