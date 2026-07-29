/**
 * pipeAnimation.js — Animated flow particle generation for the Digital Twin.
 *
 * Creates moving particle positions along pipe paths based on
 * real-time flow rates and an animation clock.
 */

import { flowToSpeed } from './colorScale';
import { interpolatePipePath } from './geoHelpers';

/**
 * Number of particles per pipe for flow visualization.
 */
const PARTICLES_PER_PIPE = 6;

/**
 * Generate animated flow particle positions for all pipes.
 * Each particle moves along its pipe's path at a speed determined
 * by the pipe's flow rate. When flow is 0, particles freeze.
 *
 * @param {object[]} pipeFeatures - GeoJSON features from /api/v1/network/pipes
 * @param {object} nodeMap - Map of node_id → { flow_lps, ... }
 * @param {number} currentTime - Animation clock time in seconds
 * @returns {object[]} Array of { position: [lon, lat], color: [r,g,b,a], radius, pipeId }
 */
export function createFlowParticles(pipeFeatures, nodeMap, currentTime) {
  if (!pipeFeatures || !pipeFeatures.length) return [];

  const particles = [];

  for (const feature of pipeFeatures) {
    const props = feature.properties;
    const coords = feature.geometry.coordinates;
    const path = interpolatePipePath(coords, 40);

    if (path.length < 2) continue;

    // Determine flow rate from connected nodes
    const fromNode = nodeMap[props.from_node];
    const toNode = nodeMap[props.to_node];
    const flowLps = fromNode?.flow_lps || toNode?.flow_lps || props.flow_lps || 0;
    const speed = flowToSpeed(flowLps);

    if (speed <= 0) continue; // No particles when flow is zero

    // Generate multiple particles spread along the pipe
    for (let i = 0; i < PARTICLES_PER_PIPE; i++) {
      // Each particle has an offset phase to distribute evenly
      const phase = i / PARTICLES_PER_PIPE;
      // Position along path oscillates with time and speed
      const t = ((currentTime * speed * 0.3) + phase) % 1.0;
      const idx = Math.min(Math.floor(t * (path.length - 1)), path.length - 2);
      const frac = (t * (path.length - 1)) - idx;

      const lon = path[idx][0] + (path[idx + 1][0] - path[idx][0]) * frac;
      const lat = path[idx][1] + (path[idx + 1][1] - path[idx][1]) * frac;

      // Particle brightness pulses slightly
      const pulse = 180 + Math.sin(currentTime * 3 + i) * 40;

      particles.push({
        position: [lon, lat],
        color: [0, pulse, 255, 200],
        radius: 4 + speed * 3,
        pipeId: props.pipe_id,
      });
    }
  }

  return particles;
}

/**
 * Compute an animated dash offset for a Mapbox line-dasharray effect.
 * Creates the illusion of flowing dashes along a pipe.
 *
 * @param {number} time - Current animation time in seconds
 * @param {number} flowRate - Flow rate in L/s
 * @returns {number} Dash offset value (0–100)
 */
export function getDashOffset(time, flowRate) {
  const speed = flowToSpeed(flowRate);
  if (speed <= 0) return 0;
  return (time * speed * 20) % 100;
}
