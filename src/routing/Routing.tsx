import { FC } from "react";
import { Route, Routes } from "react-router-dom";

import { routes } from "./routesData";

const Routing: FC = () => {
  return (
    <Routes>
      {routes.map((item) => (
        <Route key={item.path} element={<item.component />} path={item.path} />
      ))}
    </Routes>
  );
};

export default Routing;
