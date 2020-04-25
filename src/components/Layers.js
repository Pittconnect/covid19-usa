export const clusterLayer = {
  id: "clusters",
  type: "circle",
  source: "covid-19 Patient Location",
  filter: ["has", "point_count"],
  paint: {
    "circle-color": [
      "step",
      ["get", "point_count"],
      "#51bbd6",
      100,
      "#f1f075",
      750,
      "#f28cb1",
    ],
    "circle-radius": ["step", ["get", "point_count"], 20, 100, 30, 750, 40],
  },
};

export const clusterCountLayer = {
  id: "cluster-count",
  type: "symbol",
  source: "covid-19 Patient Location",
  filter: ["has", "point_count"],
  layout: {
    "text-field": "{point_count_abbreviated}",
    "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
    "text-size": 12,
  },
};

export const unclusteredPointLayer = {
  id: "unclustered-point",
  type: "circle",
  source: "covid-19 Patient Location",
  filter: ["!", ["has", "point_count"]],
  paint: {
    "circle-color": "#11b4da",
    "circle-radius": 4,
    "circle-stroke-width": 1,
    "circle-stroke-color": "#fff",
  },
};

export const statesBoundsLayer = {
  id: "state-fills",
  type: "fill",
  source: "states",
  layout: {},
  filter: ["==", "$type", "Polygon"],
  paint: {
    "fill-color": [
      "interpolate",
      ["linear"],
      ["get", "CENSUSAREA"],
      0,
      "#FFF4EF",
      100,
      "#FEDACA",
      1000,
      "#FCB49A",
      5000,
      "#FC896C",
      10000,
      "#F75E44",
      50000,
      "#E13129",
      100000,
      "#BB171C",
      500000,
      "#8B4225",
      1000000,
      "#723122",
    ],
    "fill-opacity": [
      "case",
      ["boolean", ["feature-state", "hover"], false],
      1,
      0.8,
    ],
  },
};

export const statesBordersLayer = {
  id: "state-borders",
  type: "line",
  source: "states",
  layout: {},
  paint: {
    "line-color": [
      "case",
      ["boolean", ["feature-state", "hover"], false],
      "#FF093C",
      [
        "interpolate",
        ["linear"],
        ["get", "CENSUSAREA"],
        0,
        "#FFF4EF",
        100,
        "#FEDACA",
        1000,
        "#FCB49A",
        5000,
        "#FC896C",
        10000,
        "#F75E44",
        50000,
        "#E13129",
        100000,
        "#BB171C",
        500000,
        "#8B4225",
        1000000,
        "#723122",
      ],
    ],
    "line-opacity": [
      "case",
      ["boolean", ["feature-state", "hover"], false],
      1,
      0.5,
    ],
    "line-width": 2,
  },
};
