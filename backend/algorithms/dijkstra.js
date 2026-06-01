export const dijkstra = (locations, startId, endId, options = {}) => {
  const distances = {};
  const previous = {};
  const visited = new Set();
  const queue = [];

  Object.keys(locations).forEach((locationId) => {
    distances[locationId] = Infinity;
    previous[locationId] = null;
  });

  distances[startId] = 0;
  queue.push({ id: startId, distance: 0 });

  while (queue.length) {
    queue.sort((a, b) => a.distance - b.distance);
    const current = queue.shift();
    const currentId = current.id;

    if (visited.has(currentId)) continue;
    visited.add(currentId);

    if (currentId === endId) break;

    const node = locations[currentId];
    if (!node) continue;

    node.connections.forEach((edge) => {
      if (options.wheelchair && edge.accessible === false) return;
      if (options.emergency && edge.emergency === false) return;

      const alt = distances[currentId] + edge.distance;
      if (alt < distances[edge.to]) {
        distances[edge.to] = alt;
        previous[edge.to] = { id: currentId, direction: edge.direction };
        queue.push({ id: edge.to, distance: alt });
      }
    });
  }

  if (distances[endId] === Infinity) {
    return null;
  }

  const path = [];
  const directions = [];
  let current = endId;

  while (current) {
    path.unshift(current);
    const prev = previous[current];
    if (prev) {
      directions.unshift({ from: prev.id, to: current, direction: prev.direction });
      current = prev.id;
    } else {
      break;
    }
  }

  return {
    path,
    totalDistance: distances[endId],
    steps: directions,
  };
};
