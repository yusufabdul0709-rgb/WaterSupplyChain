/**
 * colorScale.js — Color mapping utilities for the Digital Twin visualization.
 *
 * Maps pressure, status, flow, and severity values to RGBA color arrays
 * compatible with deck.gl layers and CSS color strings.
 */

/**
 * Map pressure (bar) to an RGBA color array.
 * 7+ bar = green, 5 bar = blue, 3 bar = yellow, 1 bar = red.
 * Smoothly interpolates between thresholds.
 *
 * @param {number} bar - Pressure in bar (0–10+)
 * @returns {number[]} [r, g, b, a] where each is 0–255
 */
export function pressureToColor(bar) {
  if (bar >= 7) return [16, 185, 129, 220];    // green
  if (bar >= 5) {
    const t = (bar - 5) / 2;
    return [
      Math.round(14 + (16 - 14) * t),
      Math.round(165 + (185 - 165) * t),
      Math.round(233 + (129 - 233) * t),
      220,
    ];
  }
  if (bar >= 3) {
    const t = (bar - 3) / 2;
    return [
      Math.round(250 + (14 - 250) * t),
      Math.round(204 + (165 - 204) * t),
      Math.round(21 + (233 - 21) * t),
      220,
    ];
  }
  if (bar >= 1) {
    const t = (bar - 1) / 2;
    return [
      Math.round(239 + (250 - 239) * t),
      Math.round(68 + (204 - 68) * t),
      Math.round(68 + (21 - 68) * t),
      220,
    ];
  }
  return [239, 68, 68, 220]; // red
}

/**
 * Convert pressure RGBA to a CSS color string.
 * @param {number} bar
 * @returns {string}
 */
export function pressureToCss(bar) {
  const [r, g, b, a] = pressureToColor(bar);
  return `rgba(${r}, ${g}, ${b}, ${(a / 255).toFixed(2)})`;
}

/**
 * Map node status to an RGBA color array.
 * @param {string} status - NORMAL | WARNING | CRITICAL | OFFLINE | LEAK | BURST | BLOCKAGE
 * @returns {number[]}
 */
export function statusToColor(status) {
  switch (status) {
    case 'NORMAL':    return [0, 229, 255, 200];
    case 'WARNING':   return [250, 204, 21, 220];
    case 'CRITICAL':  return [239, 68, 68, 240];
    case 'LEAK':      return [239, 68, 68, 240];
    case 'BURST':     return [220, 38, 38, 255];
    case 'BLOCKAGE':  return [251, 146, 60, 220];
    case 'OFFLINE':   return [100, 116, 139, 150];
    default:          return [148, 163, 184, 160];
  }
}

/**
 * Map node status to a CSS color string.
 * @param {string} status
 * @returns {string}
 */
export function statusToCss(status) {
  switch (status) {
    case 'NORMAL':    return '#00e5ff';
    case 'WARNING':   return '#facc15';
    case 'CRITICAL':  return '#ef4444';
    case 'LEAK':      return '#ef4444';
    case 'BURST':     return '#dc2626';
    case 'BLOCKAGE':  return '#fb923c';
    case 'OFFLINE':   return '#64748b';
    default:          return '#94a3b8';
  }
}

/**
 * Convert flow rate (L/s) to an animation speed multiplier.
 * 0 L/s → 0 (stopped), 10 L/s → 0.25, 40+ L/s → 1.0
 *
 * @param {number} flowLps - Flow rate in liters per second
 * @returns {number} 0–1 speed multiplier
 */
export function flowToSpeed(flowLps) {
  if (flowLps <= 0) return 0;
  return Math.min(1, flowLps / 40);
}

/**
 * Map alert severity to RGBA color.
 * @param {string} severity - CRITICAL | HIGH | WARNING
 * @returns {number[]}
 */
export function severityToColor(severity) {
  switch (severity) {
    case 'CRITICAL': return [239, 68, 68, 255];
    case 'HIGH':     return [251, 146, 60, 240];
    case 'WARNING':  return [250, 204, 21, 220];
    default:         return [148, 163, 184, 180];
  }
}

/**
 * Map alert severity to CSS string.
 * @param {string} severity
 * @returns {string}
 */
export function severityToCss(severity) {
  switch (severity) {
    case 'CRITICAL': return '#ef4444';
    case 'HIGH':     return '#fb923c';
    case 'WARNING':  return '#facc15';
    default:         return '#94a3b8';
  }
}

/**
 * Map node type to an emoji/icon character for map markers.
 * @param {string} type - RESERVOIR | JUNCTION | PUMP | TANK
 * @returns {string}
 */
export function nodeTypeIcon(type) {
  switch (type) {
    case 'RESERVOIR': return '🏗️';
    case 'PUMP':      return '⚙️';
    case 'TANK':      return '🛢️';
    case 'JUNCTION':  return '🔗';
    default:          return '📍';
  }
}
