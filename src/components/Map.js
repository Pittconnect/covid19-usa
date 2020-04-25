import React, { useRef, useState /* , useEffect */ } from "react";
import ReactMapGL, { Source, Layer } from "react-map-gl";
// import SheetJSApp from "./sheetjs";
import {
  clusterLayer,
  clusterCountLayer,
  unclusteredPointLayer,
  statesBoundsLayer,
  statesBordersLayer,
} from "./Layers";

import { GeoData, usGeoJson } from "../data";

const TOKEN = process.env.REACT_APP_MAPBOX_ACCESS;

const Map = () => {
  const [viewport, setViewport] = useState({
    latitude: 40.67,
    longitude: -103.59,
    zoom: 3,
    bearing: 0,
    pitch: 0,
  });
  const [isLoaded, setIsLoaded] = useState(false);
  // const [isLoadedData, setIsLoadedData] = useState(false);
  // const [items, setItems] = useState([]);

  const mapRef = useRef();
  const _sourceRef = useRef();
  const hoveredStateId = useRef(null);

  const _onLoad = () => setIsLoaded(true);

  const _onViewportChange = (viewport) => setViewport(viewport);

  const _onMouseMove = (event) => {
    if (isLoaded) {
      const map = mapRef.current.getMap();
      const { features } = event;

      const hoveredFeature =
        features && features.find((f) => f.layer.id === "state-fills");

      if (hoveredFeature) {
        if (features.length > 0) {
          if (hoveredStateId.current) {
            map.setFeatureState(
              { source: "states", id: hoveredStateId.current },
              { hover: false }
            );
          }
          hoveredStateId.current = hoveredFeature.id;
          map.setFeatureState(
            { source: "states", id: hoveredStateId.current },
            { hover: true }
          );
        }
      } else {
        map.setFeatureState(
          { source: "states", id: hoveredStateId.current },
          { hover: false }
        );
        hoveredStateId.current = null;
      }
    }
  };

  // const fetchDataAPI = () => {
  //   setIsLoadedData(true);
  //   fetch("https://covid19-data.p.rapidapi.com/geojson-us", {
  //     method: "GET",
  //     headers: {
  //       "x-rapidapi-host": "covid19-data.p.rapidapi.com",
  //       "x-rapidapi-key": "5876e1d086mshe6d5c492e4770d2p1663cajsn8ca9a31f7677",
  //     },
  //   })
  //     .then((res) => res.json())
  //     .then(
  //       (result) => {
  //         setItems(result);
  //         setIsLoadedData(false);
  //       },

  //       (error) => {
  //         setIsLoadedData(false);
  //         console.log("error: ", error);
  //       }
  //     );
  // };

  // useEffect(() => {
  //   console.log("items: ", items);
  //   // console.log("isLoadedData: ", isLoadedData);
  // }, [items]);

  return (
    <div>
      {/* <button onClick={fetchDataAPI}>fetch data</button> */}
      {/* {isLoadedData && <div>loading</div>} */}
      <ReactMapGL
        {...viewport}
        ref={mapRef}
        width="100vw"
        height="100vh"
        mapboxApiAccessToken={TOKEN}
        // mapStyle="mapbox://styles/alexnorvag/ck9efq0oz2d0x1ioftrtazzyz"
        mapStyle="mapbox://styles/alexnorvag/ck9efq0oz2d0x1ioftrtazzyz/draft"
        // mapStyle="mapbox://styles/alexnorvag/ck98f0bv407ho1iodg8raxrm4"
        // mapStyle="mapbox://styles/alexnorvag/ck98f0bv407ho1iodg8raxrm4/draft"
        onViewportChange={_onViewportChange}
        onLoad={_onLoad}
        onHover={_onMouseMove}
      >
        <Source
          id="states"
          type="geojson"
          data={usGeoJson}
          ref={_sourceRef}
          generateId={true}
        >
          <Layer {...statesBoundsLayer} beforeId={"waterway-label"} />
          <Layer {...statesBordersLayer} beforeId={"waterway-label"} />
        </Source>
        <Source
          type="geojson"
          data={GeoData}
          // generateId={true}
          // promoteId={true}
          cluster={true}
          clusterMaxZoom={14}
          clusterRadius={50}
          ref={_sourceRef}
        >
          <Layer {...clusterLayer} />
          <Layer {...clusterCountLayer} />
          <Layer {...unclusteredPointLayer} />
        </Source>
      </ReactMapGL>
    </div>
  );
};

export default Map;
