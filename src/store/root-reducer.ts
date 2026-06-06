import { combineReducers } from '@reduxjs/toolkit';
import appProcess from './slices/app-process';
import dataProcess from './slices/data-process';
import userProcess from './slices/user-process';

export const rootReducer = combineReducers({
  APP: appProcess,
  DATA: dataProcess,
  USER: userProcess,
});
