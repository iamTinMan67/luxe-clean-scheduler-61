import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import DataMigration from "@/components/DataMigration";

const App = () => {
  return (
    <>
      <DataMigration />
      <RouterProvider router={router} />
    </>
  );
};

export default App
