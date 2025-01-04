interface IRoute {
  path?: string;
  icon?: string;
  name: string;
  routes?: IRoute[];
  roles?: string[]; // Add roles property
  checkActive?(pathname: string, route: IRoute): boolean;
  exact?: boolean;
}

export function routeIsActive(pathname: string, route: IRoute): boolean {
  if (route.checkActive) {
    return route.checkActive(pathname, route);
  }

  return route?.exact
    ? pathname === route?.path
    : route?.path
      ? pathname.indexOf(route.path) === 0
      : false;
}

const routes: IRoute[] = [
  {
    path: '/example',
    icon: 'HomeIcon',
    name: 'Dashboard',
    exact: true,
    roles: ['ROLE_ADMIN', 'ROLE_USER'], // Accessible by all roles
  },
  {
    path: '/example/payment',
    icon: 'FormsIcon',
    name: 'Payment',
    roles: ['ROLE_ADMIN'], // Only admin
  },
  {
    path: '/example/token',
    icon: 'FormsIcon',
    name: 'Token',
    roles: ['ROLE_ADMIN'], // Only admin
  },
  {
    path: '/example/buytoken',
    icon: 'FormsIcon',
    name: 'Buy Token',
    roles: ['ROLE_ADMIN', 'ROLE_USER'], // Only users with ROLE_USER
  },
  {
    path: '/example/customer',
    icon: 'TablesIcon',
    name: 'Customer',
    roles: ['ROLE_ADMIN'], // Only admin
  },
  {
    path: '/example/genco',
    icon: 'TablesIcon',
    name: 'Provider',
    roles: ['ROLE_ADMIN'], // Only admin
  },
  {
    path: '/example/user',
    icon: 'TablesIcon',
    name: 'User',
    roles: ['ROLE_ADMIN'], // Only admin
  },
  {
    path: '/example/role',
    icon: 'TablesIcon',
    name: 'Role',
    roles: ['ROLE_ADMIN'], // Only admin
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
export default routes;
