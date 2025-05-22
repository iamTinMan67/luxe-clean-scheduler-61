
import { RouterProvider } from 'react-router-dom'
import router from './router'
import DataMigration from "@/components/DataMigration";
import { AuthProvider } from "@/context/AuthContext";

const App = () => {
  console.log("App component rendering");
  return (
    <AuthProvider>
      <DataMigration />
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;
