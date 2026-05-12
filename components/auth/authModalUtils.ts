import type { Location, NavigateFunction } from 'react-router-dom';

export type AuthMode = 'login' | 'signup';

export const buildAuthModalHref = (pathname: string, search: string, mode: AuthMode) => {
  const params = new URLSearchParams(search);
  params.set('auth', mode);
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
};

export const openAuthModal = (
  navigate: NavigateFunction,
  location: Pick<Location, 'pathname' | 'search'>,
  mode: AuthMode,
) => {
  navigate(buildAuthModalHref(location.pathname, location.search, mode));
};

