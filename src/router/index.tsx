
import { createBrowserRouter } from "react-router-dom";
import publicRoutes from "./publicRoutes";
import adminRoutes from "./adminRoutes";
import dataMigrationRoutes from "./dataMigrationRoutes";

// Combine all routes
const router = createBrowserRouter([
  ...publicRoutes,
  ...adminRoutes,
  ...dataMigrationRoutes,
]);

export default router;
