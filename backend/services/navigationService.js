import Location from "../models/Location.js";
import { dijkstra } from "../algorithms/dijkstra.js";

export const buildLocationGraph = async () => {
  const locations = await Location.find({});
  const graph = {};
  locations.forEach((location) => {
    graph[location._id] = {
      name: location.name,
      landmark: location.landmark,
      floor: location.floor,
      image: location.image,
      connections: location.connections.map((edge) => ({
        to: edge.to,
        distance: edge.distance,
        direction: edge.direction,
        accessible: edge.accessible,
        emergency: edge.emergency,
      })),
    };
  });
  return graph;
};

export const findShortestPath = async (fromId, toId, options = {}) => {
  const graph = await buildLocationGraph();
  const result = dijkstra(graph, fromId, toId, options);
  if (!result) {
    return null;
  }

  const distance = result.totalDistance;
  const estimatedTime = Math.ceil(distance / 40);
  const path = result.path.map((locationId) => ({
    id: locationId,
    name: graph[locationId]?.name || locationId,
    landmark: graph[locationId]?.landmark || "",
    floor: graph[locationId]?.floor || 0,
    image: graph[locationId]?.image || "",
  }));

  const steps = result.steps.map((step, index) => ({
    step: index + 1,
    from: graph[step.from]?.name || step.from,
    to: graph[step.to]?.name || step.to,
    direction: step.direction,
    landmark: graph[step.to]?.landmark || "",
    floor: graph[step.to]?.floor || 0,
  }));

  return {
    path,
    distance: `${distance} meters`,
    time: `${estimatedTime} mins`,
    steps,
  };
};
