// Porpuse :Define the authenticated and unauthenticated routes
import React from 'react';
export interface AuthenticatedRoutes {
  Home: React.ElementType;
  NewTicket: React.ElementType;
}
export interface UnauthenticatedRoutes {
  Signin: React.ElementType;
  Signup: React.ElementType;
  Recovery: React.ElementType;
}

