interface IRoute {
  path?: string;
  icon?: string;
  name: string;
  routes?: IRoute[];
  roles?: string[]; // Add roles property
  checkActive?(pathname: string, route: IRoute): boolean;
  exact?: boolean;
}

export function userRouteIsActive(pathname: string, route: IRoute): boolean {
  if (route.checkActive) {
    return route.checkActive(pathname, route);
  }

  return route?.exact
    ? pathname === route?.path
    : route?.path
      ? pathname.indexOf(route.path) === 0
      : false;
}

const user_routes: IRoute[] = [
  {
    path: '/example/payment',
    icon: 'FormsIcon',
    name: 'Payment',
  },
  {
    path: '/example/buytoken',
    icon: 'FormsIcon',
    name: 'Buy Token',
  },
];

// Function to filter routes based on user roles
export function getAccessibleRoutes(userRoles: string[], routes: IRoute[]): IRoute[] {
  return routes.filter((route) => {
    if (!route.roles) return true; // If no roles are defined, it's accessible to all
    return route.roles.some((role) => userRoles.includes(role));
  });
}

export type { IRoute };
export default user_routes;
