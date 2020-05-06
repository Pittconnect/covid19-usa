import React, { useRef, useState, useEffect } from "react";
import ReactMapGL, {
  Source,
  Layer,
  Popup,
  NavigationControl,
  WebMercatorViewport,
} from "react-map-gl";
import {
  // clusterLayer,
  // clusterCountLayer,
  // unclusteredPointLayer,
  statesBoundLayer,
  statesBorderLayer,
  countiesBoundLayer,
  countiesBorderLayer,
} from "./Layers";
import Spiner from "./spiner/Spiner";
import ConcentricChart from "./charts/ConcentricChart";

import { /* GeoData, */ usGeoJsonCounties, usGeoJsonStates } from "../data";
import { usaStatesAbbr, COVIDTRACKER_API_LINK } from "../helpers";
import { useFetch } from "../hooks";

const TOKEN = process.env.REACT_APP_MAPBOX_ACCESS;

const bounds = [
  [-179.999, 16.01619],
  [-64.46466, 71.757764],
];

const Map = () => {
  const [viewport, setViewport] = useState({
    latitude: 40.54097864298709,
    longitude: -99.81367290280828,
    zoom: 3,
    bearing: 0,
    pitch: 0,
  });
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [popupCoords, setPopupCoords] = useState({});
  const [{ data: trackers, isLoading: isTrackersLoading, error }] = useFetch(
    COVIDTRACKER_API_LINK
  );
  const [isLoading, setIsLoading] = useState(false);
  const [chartData, setChartData] = useState({
    death: 24,
    hospitalizedCurrently: 75,
    positive: 2721,
    totalTestResults: 19022,
  });

  const mapRef = useRef();
  const _sourceRef = useRef();
  const hoveredStateId = useRef(null);
  const hoveredStateSource = useRef(null);

  const _onLoad = () => setIsMapLoaded(true);

  const _onViewportChange = (_viewport) => {
    const { width, height, zoom } = _viewport;
    const vp = new WebMercatorViewport(_viewport);
    const ws = vp.unproject([0, height]);
    const en = vp.unproject([width, 0]);

    if (en[0] > bounds[1][0]) {
      if (zoom < viewport.zoom) {
        // const zoomDiff = viewport.zoom - zoom;
        // setViewport((v) => ({ ...v, longitude: v.longitude - zoomDiff }));
        setViewport((v) => ({ ...v, longitude: v.longitude - 1 }));
      } else {
        setViewport((v) => ({
          ...v,
          longitude: v.longitude - 0.1,
          // longitude: v.longitude - ((en[0] - bounds[1][0]) / 10),
        }));
      }
    } else if (en[1] > bounds[1][1]) {
      if (zoom < viewport.zoom) {
        setViewport((v) => ({ ...v, latitude: v.latitude - 1 }));
      } else {
        setViewport((v) => ({ ...v, latitude: v.latitude - 0.1 }));
      }
    } else if (ws[0] < bounds[0][0]) {
      if (zoom < viewport.zoom) {
        setViewport((v) => ({ ...v, longitude: v.longitude + 1 }));
      } else {
        setViewport((v) => ({ ...v, longitude: v.longitude + 0.1 }));
      }
    } else if (ws[1] < bounds[0][1]) {
      if (zoom < viewport.zoom) {
        setViewport((v) => ({ ...v, latitude: v.latitude + 1 }));
      } else {
        setViewport((v) => ({ ...v, latitude: v.latitude + 0.1 }));
      }
    } else {
      setViewport(_viewport);
    }
  };

  const _onMouseHover = (event) => {
    if (isMapLoaded) {
      const map = mapRef.current.getMap();
      const mapZoom = map.getZoom();
      const hoveredLayer = mapZoom > 5 ? "counties" : "states";
      const { features, lngLat } = event;

      const hoveredFeature = features.find(
        (f) => f.layer.id === "state-bound" || f.layer.id === "county-bound"
      );
      if (hoveredFeature) {
        const [longitude, latitude] = lngLat;
        setPopupCoords({ longitude, latitude });

        getInfoAboutState(hoveredFeature, mapZoom);

        if (hoveredStateSource.current) {
          map.setFeatureState(
            { source: hoveredStateSource.current, id: hoveredStateId.current },
            { hover: false }
          );
        }

        hoveredStateId.current = hoveredFeature.id;
        hoveredStateSource.current = hoveredFeature.source;

        map.setFeatureState(
          { source: hoveredStateSource.current, id: hoveredStateId.current },
          { hover: true }
        );
      } else {
        setPopupCoords({});
        map.setFeatureState(
          {
            source: hoveredStateSource.current || hoveredLayer,
            id: hoveredStateId.current,
          },
          { hover: false }
        );

        hoveredStateId.current = null;
        hoveredStateSource.current = null;
      }
    }
  };

  const getInfoAboutState = (feature, mapZoom) => {
    const stateName = feature.properties.NAME;
    const stateAbbr = usaStatesAbbr.find(
      (stateAbbr) => stateAbbr.label === stateName
    );

    if (mapZoom < 5) {
      const {
        positive,
        hospitalizedCurrently,
        death,
        totalTestResults,
      } = trackers.find((tracker) => tracker.state === stateAbbr.value);

      if (!error) {
        setChartData({
          positive,
          hospitalizedCurrently,
          death,
          totalTestResults,
          stateName,
        });
      }
    } else {
      setChartData({});
    }
  };

  useEffect(() => {
    if (!isMapLoaded || isTrackersLoading) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [isMapLoaded, isTrackersLoading]);

  return (
    <div className="map-container">
      {isLoading && (
        <div className="map-spinner">
          <Spiner />
        </div>
      )}
      <ReactMapGL
        {...viewport}
        ref={mapRef}
        width="100vw"
        height="100vh"
        mapboxApiAccessToken={TOKEN}
        mapStyle="mapbox://styles/alexnorvag/ck9efq0oz2d0x1ioftrtazzyz"
        // mapStyle="mapbox://styles/alexnorvag/ck9efq0oz2d0x1ioftrtazzyz/draft"
        // mapStyle="mapbox://styles/alexnorvag/ck98f0bv407ho1iodg8raxrm4"
        // mapStyle="mapbox://styles/alexnorvag/ck98f0bv407ho1iodg8raxrm4/draft"
        onViewportChange={_onViewportChange}
        onLoad={_onLoad}
        onHover={_onMouseHover}
        minZoom={4}
      >
        {Object.entries(popupCoords).length !== 0 &&
          Object.entries(chartData).length !== 0 && (
            <Popup
              latitude={popupCoords.latitude}
              longitude={popupCoords.longitude}
              closeButton={false}
              anchor="bottom"
              offsetTop={-20}
            >
              <div className="popup-container">
                <div className="popup-chart">
                  <ConcentricChart
                    data={chartData}
                    dataKeys={[
                      "totalTestResults",
                      "positive",
                      "hospitalizedCurrently",
                      "death",
                    ]}
                    width={360}
                    height={280}
                    top={10}
                    bottom={10}
                    left={10}
                    right={10}
                  />
                </div>
              </div>
            </Popup>
          )}
        <Source
          id="counties"
          type="geojson"
          data={usGeoJsonCounties}
          ref={_sourceRef}
          generateId={true}
        >
          <Layer {...countiesBoundLayer} beforeId={"waterway-label"} />
          <Layer {...countiesBorderLayer} beforeId={"waterway-label"} />
        </Source>
        <Source
          id="states"
          type="geojson"
          data={usGeoJsonStates}
          ref={_sourceRef}
          generateId={true}
        >
          <Layer {...statesBoundLayer} beforeId={"waterway-label"} />
          <Layer {...statesBorderLayer} beforeId={"waterway-label"} />
        </Source>

        {/* <Source
          type="geojson"
          data={GeoData}
          cluster={true}
          clusterMaxZoom={14}
          clusterRadius={50}
          ref={_sourceRef}
        >
          <Layer {...clusterLayer} />
          <Layer {...clusterCountLayer} />
          <Layer {...unclusteredPointLayer} />
        </Source> */}
        <div className="map-navigation">
          <NavigationControl showCompass={false} />
        </div>
      </ReactMapGL>
    </div>
  );
};

export default Map;
