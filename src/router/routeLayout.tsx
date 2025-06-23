
import Layout from "@/components/layout/Layout";
import DataMigrationTrigger from "@/components/DataMigrationTrigger";

// Shared layout wrapper with DataMigrationTrigger
export const RouteLayout = () => {
  return (
    <>
      <DataMigrationTrigger />
      <Layout />
    </>
  );
};
