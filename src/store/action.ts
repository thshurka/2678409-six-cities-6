import { createAction } from '@reduxjs/toolkit';
import { AuthorizationStatus } from '../types/auth';
import { Offer } from '../types/offer';

export const changeCity = createAction<string>('main/changeCity');
export const fillOffers = createAction<Offer[]>('main/fillOffers');
export const setAuthorizationStatus = createAction<AuthorizationStatus>('user/setAuthorizationStatus');
