/**
 * geoHelpers.js — GeoJSON geometry utilities for the Digital Twin.
 *
 * Provides interpolation, bounding box, and trip generation helpers
 * for pipe network visualization and deck.gl TripsLayer data.
 */

/**
 * Interpolate a pipe path into more points for smoother animation.
 * Uses linear interpolation between the existing coordinates.
 *
 * @param {number[][]} coords - Array of [lon, lat] coordinate pairs
 * @param {number} numPoints - Target number of interpolated points
 * @returns {number[][]} Interpolated [lon, lat] array
 */
export function interpolatePipePath(coords, numPoints = 20) {
  if (!coords || coords.length < 2) return coords || [];
  if (coords.length >= numPoints) return coords;

  const result = [];
  const totalSegments = coords.length - 1;
  const pointsPerSegment = Math.max(1, Math.floor(numPoints / totalSegments));

  for (let i = 0; i < totalSegments; i++) {
    const [lon1, lat1] = coords[i];
    const [lon2, lat2] = coords[i + 1];

    for (let j = 0; j < pointsPerSegment; j++) {
      const t = j / pointsPerSegment;
      result.push([
        lon1 + (lon2 - lon1) * t,
        lat1 + (lat2 - lat1) * t,
      ]);
    }
  }
  // Always include the last point
  result.push(coords[coords.length - 1]);
  return result;
}

/**
 * Calculate the distance between two [lon, lat] points in meters.
 * Uses the Haversine formula.
 *
 * @param {number[]} p1 - [lon, lat]
 * @param {number[]} p2 - [lon, lat]
 * @returns {number} Distance in meters
 */
export function haversineDistance(p1, p2) {
  const R = 6371000;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(p2[1] - p1[1]);
  const dLon = toRad(p2[0] - p1[0]);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(p1[1])) * Math.cos(toRad(p2[1])) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Generate flow particle trips for deck.gl ScatterplotLayer animation.
 * Creates particles distributed along each pipe with timestamps
 * proportional to their position along the path.
 *
 * @param {object[]} pipeFeatures - GeoJSON features from /api/v1/network/pipes
 * @param {object} nodeMap - Map of node_id → { pressure_bar, flow_lps, ... }
 * @param {number} loopDuration - Duration of one full traversal in seconds
 * @returns {object[]} Array of { path, timestamps, flowLps, pipeId }
 */
export function generateFlowTrips(pipeFeatures, nodeMap, loopDuration = 10) {
  if (!pipeFeatures || !pipeFeatures.length) return [];

  return pipeFeatures.map((feature) => {
    const props = feature.properties;
    const coords = feature.geometry.coordinates;
    const interpolated = interpolatePipePath(coords, 30);

    // Get flow from connected nodes
    const fromNode = nodeMap[props.from_node];
    const toNode = nodeMap[props.to_node];
    const flowLps = fromNode?.flow_lps || toNode?.flow_lps || props.flow_lps || 0;

    // Generate timestamps: evenly spaced across loop duration
    const timestamps = interpolated.map((_, idx) => {
      return (idx / (interpolated.length - 1)) * loopDuration;
    });

    return {
      path: interpolated,
      timestamps,
      flowLps,
      pipeId: props.pipe_id,
      fromNode: props.from_node,
      toNode: props.to_node,
      diameterMm: props.diameter_mm,
      status: props.status,
    };
  });
}

/**
 * Compute the bounding box of all nodes for camera fitting.
 *
 * @param {object[]} nodes - Array of { lat, lon }
 * @returns {{ minLon: number, minLat: number, maxLon: number, maxLat: number, centerLon: number, centerLat: number }}
 */
export function getNetworkBounds(nodes) {
  if (!nodes || !nodes.length) {
    return { minLon: 78.47, minLat: 17.40, maxLon: 78.50, maxLat: 17.44, centerLon: 78.485, centerLat: 17.42 };
  }

  let minLon = Infinity, minLat = Infinity;
  let maxLon = -Infinity, maxLat = -Infinity;

  for (const node of nodes) {
    if (node.lon < minLon) minLon = node.lon;
    if (node.lon > maxLon) maxLon = node.lon;
    if (node.lat < minLat) minLat = node.lat;
    if (node.lat > maxLat) maxLat = node.lat;
  }

  return {
    minLon,
    minLat,
    maxLon,
    maxLat,
    centerLon: (minLon + maxLon) / 2,
    centerLat: (minLat + maxLat) / 2,
  };
}

/**
 * Build a lookup map from node_id to its full data object.
 *
 * @param {object[]} nodes - Array of node objects from the API
 * @returns {object} Map of node_id → node data
 */
export function buildNodeMap(nodes) {
  const map = {};
  for (const node of nodes) {
    map[node.node_id] = {
      ...node,
      ...(node.current || {}),
    };
  }
  return map;
}

/**
 * Get pipe width for rendering based on diameter.
 * Scales diameter_mm (200–400) to pixel width (3–8).
 *
 * @param {number} diameterMm
 * @returns {number}
 */
export function pipeWidth(diameterMm) {
  return Math.max(3, Math.min(8, (diameterMm / 400) * 8));
}
