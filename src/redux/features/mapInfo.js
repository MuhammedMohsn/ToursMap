import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  center: { lat: null, lng: null },
  user: { lat: null, lng: null },
};

const mapInfo = createSlice({
  name: "mapInfo",
  initialState,
  reducers: {
    getMap: (state, action) => {
      state.center = action.payload;
      state.user = action.payload;
    },
    getMapCenter: (state, action) => {
      state.center = action.payload;
    },
    getUserLocation: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { setMap, setMapCenter, setUserLocation } = mapInfo.actions;
export default mapInfo.reducer;
