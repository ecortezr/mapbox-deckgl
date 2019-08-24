import React from "react";
import DeckGL, { ScatterplotLayer, ColumnLayer } from "deck.gl";
import { StaticMap, InteractiveMap } from "react-map-gl";

import { MapboxLayer } from "@deck.gl/mapbox";

import { data } from "./data";

const INITIAL_VIEW_STATE = {
  latitude: 37.79088771,
  longitude: -122.403241,
  zoom: 10,
  pitch: 60,
  bearing: -27.396674584323023
};

export default class App extends React.Component {
  state = {
    hoveredObject: null,
    pointerX: 0,
    pointerY: 0
  };

  // DeckGL and mapbox will both draw into this WebGL context
  _onWebGLInitialized = gl => {
    this.setState({ gl });
  };

  _onMapLoad = () => {
    const map = this._map;
    const deck = this._deck;

    // map.addLayer(new MapboxLayer({ id: "my-scatterplot", deck }));
    map.addLayer(new MapboxLayer({ id: "my-column-layer", deck }));
  };

  _renderTooltip = () => {
    // if (!this.state.hoveredObject) return;

    const { hoveredObject, pointerX, pointerY } = this.state || {};
    // console.log(this.state);
    return (
      hoveredObject && (
        <div
          style={{
            position: "absolute",
            backgroundColor: "#fff",
            color: "#777",
            zIndex: 1,
            pointerEvents: "none",
            left: pointerX,
            top: pointerY
          }}
        >
          {`Height: ${hoveredObject.value * 5000}m`}
        </div>
      )
    );
  };

  render() {
    const { gl } = this.state;
    const layers = [
      /* new ScatterplotLayer({
        id: "my-scatterplot",
        data: [{ position: [-74.5, 40], size: 100 }],
        getPosition: d => d.position,
        getRadius: d => d.size,
        getColor: [255, 0, 0]
      }), */
      new ColumnLayer({
        id: "my-column-layer",
        data,
        diskResolution: 12,
        radius: 250,
        extruded: true,
        pickable: true,
        elevationScale: 5000,
        getPosition: d => d.centroid,
        getFillColor: d => [48, 128, d.value * 255, 255],
        getLineColor: [0, 0, 0],
        getElevation: d => d.value,
        /* onHover: ({ object, x, y }) => {
          const tooltip = object ? `Height: ${object.value * 5000}m` : "";
          // http://deck.gl/#/documentation/developer-guide/adding-interactivity?section=example-display-a-tooltip-for-hovered-object
        } */
        onHover: info =>
          this.setState({
            hoveredObject: info.object,
            pointerX: info.x,
            pointerY: info.y
          })
      })
    ];

    return (
      <DeckGL
        ref={ref => {
          // save a reference to the Deck instance
          this._deck = ref && ref.deck;
        }}
        layers={layers}
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        onWebGLInitialized={this._onWebGLInitialized}
      >
        {gl && (
          <InteractiveMap
            ref={ref => {
              // save a reference to the mapboxgl.Map instance
              this._map = ref && ref.getMap();
            }}
            gl={gl}
            mapStyle="mapbox://styles/mapbox/dark-v10"
            mapboxApiAccessToken="pk.eyJ1IjoiZWNvcnRlenIiLCJhIjoiY2p5dWxpZDFqMGdjMDNjb2FtaDk3ZHZwbyJ9.qXM-r1f-0q2xzLNoFpHD5g"
            onLoad={this._onMapLoad}
            dragPan={false}
            dragRotate={true}
            touchRotate={true}
          />
        )}
        {this._renderTooltip}
      </DeckGL>
    );
  }
}

/* import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App; */
