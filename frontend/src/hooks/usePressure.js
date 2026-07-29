/**
 * usePressure.js — Pressure heatmap data hook for the Digital Twin.
 *
 * Consumes node data and generates heatmap-ready point arrays
 * with pressure-normalized weights for deck.gl HeatmapLayer.
 */

import { useMemo } from 'react';

/**
 * @param {object[]} nodes - Nodes from useTelemetry, each with { lat, lon, current: { pressure_bar } }
 * @returns {{ pressurePoints: number[][], pressureRange: { min: number, max: number } }}
 */
export default function usePressure(nodes) {
  const pressureData = useMemo(() => {
    if (!nodes || !nodes.length) {
      return { pressurePoints: [], pressureRange: { min: 0, max: 10 } };
    }

    let min = Infinity;
    let max = -Infinity;

    const points = nodes.map((node) => {
      const pressure = node.current?.pressure_bar ?? 0;
      if (pressure < min) min = pressure;
      if (pressure > max) max = pressure;

      return {
        position: [node.lon, node.lat],
        weight: pressure,
        nodeId: node.node_id,
      };
    });

    // Normalize weights to 0–1 range for heatmap
    const range = max - min || 1;
    const normalizedPoints = points.map((p) => ({
      ...p,
      weight: (p.weight - min) / range,
    }));

    return {
      pressurePoints: normalizedPoints,
      pressureRange: { min: min === Infinity ? 0 : min, max: max === -Infinity ? 10 : max },
    };
  }, [nodes]);

  return pressureData;
}
