import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthMode, buildAuthModalHref } from './authModalUtils';

type AuthLinkProps = {
  mode: AuthMode;
  className?: string;
  children: React.ReactNode;
};

const AuthLink: React.FC<AuthLinkProps> = ({ mode, className, children }) => {
  const location = useLocation();

  return (
    <Link
      to={buildAuthModalHref(location.pathname, location.search, mode)}
      className={className}
    >
      {children}
    </Link>
  );
};

export default AuthLink;

