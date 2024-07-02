import {
  Route,
  RouterProvider,
  Routes,
  createBrowserRouter,
} from "react-router-dom";
import Home from "@/app/home";
import AnimationList from "@/app/animations/view/animation-list";
import AnimationPreview from "../animations/view/animation-preview";
import { APP_ROUTES } from "./routesConstants";

const Root = (): JSX.Element => {
  return (
    <Routes>
      <Route path={APP_ROUTES.home} element={<Home />}>
        <Route path={APP_ROUTES.animations} element={<AnimationList />} />
        <Route
          path={APP_ROUTES.animationsPreview}
          element={<AnimationPreview />}
        />
      </Route>
    </Routes>
  );
};

const router = createBrowserRouter([{ path: "*", Component: Root }]);

const AppRoutes = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;
