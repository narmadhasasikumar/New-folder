import { findShortestPath } from "../services/navigationService.js";

export const getRoute = async (req, res, next) => {
  try {
    const from = req.query.from;
    const to = req.query.to;
    if (!from || !to) {
      return res.status(400).json({ message: "Please provide from and to location IDs" });
    }
    const options = {
      wheelchair: req.query.wheelchair === "true",
      emergency: req.query.emergency !== "false",
    };
    const route = await findShortestPath(from, to, options);
    if (!route) {
      return res.status(404).json({ message: "No route found" });
    }
    res.json(route);
  } catch (error) {
    next(error);
  }
};
