
import { Routes, Route } from "react-router-dom";
import publicRoutes from "./publicRoutes";
import adminRoutes from "./adminRoutes";
import dataMigrationRoutes from "./dataMigrationRoutes";
import NotFound from "@/pages/NotFound";

const AppRouter = () => {
  return (
    <Routes>
      {/* Public Routes */}
      {publicRoutes.map((route) => (
        <Route key={route.path} path={route.path} element={route.element}>
          {route.children?.map((childRoute) => (
            <Route 
              key={childRoute.path} 
              path={childRoute.path} 
              element={childRoute.element} 
            />
          ))}
        </Route>
      ))}
      
      {/* Admin Routes */}
      {adminRoutes.map((route) => (
        <Route key={route.path} path={route.path} element={route.element}>
          {route.children?.map((childRoute) => (
            <Route 
              key={childRoute.path} 
              path={childRoute.path} 
              element={childRoute.element} 
            />
          ))}
        </Route>
      ))}
      
      {/* Data Migration Routes */}
      {dataMigrationRoutes.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}
      
      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;
