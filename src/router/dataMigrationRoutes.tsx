
import { RouteObject } from "react-router-dom";
import DataMigration from "@/components/DataMigration";

const dataMigrationRoutes: RouteObject[] = [
  {
    path: "/data-migration",
    element: <DataMigration />,
  },
];

export default dataMigrationRoutes;
