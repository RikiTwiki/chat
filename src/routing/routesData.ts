import { FunctionComponent } from "react";

import { Home } from "components/index";
import { RoutesEnum } from "shared/constants/routesEnum";

interface IRoute {
  path: string;
  component: FunctionComponent;
}

export const routes: IRoute[] = [{ component: Home, path: RoutesEnum.HOME }];
