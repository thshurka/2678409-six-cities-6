import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DEFAULT_CITY } from '../../const';

type AppProcess = {
  city: string;
};

const initialState: AppProcess = {
  city: DEFAULT_CITY,
};

const appProcess = createSlice({
  name: 'APP',
  initialState,
  reducers: {
    changeCity: (state, action: PayloadAction<string>) => {
      state.city = action.payload;
    },
  },
});

export const { changeCity } = appProcess.actions;
export default appProcess.reducer;
