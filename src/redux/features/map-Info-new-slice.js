import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import placesListByBBox from "../../api/places/placesListByBBox";

const initialState = {
  user: { location: { lat: null, lng: null } },
  mapCenter: { location: { lat: null, lng: null } },
  map: {},
  placesOnMap: { data: [], error: null, loading: false },
};
export const fetchPlacesListByBBox = createAsyncThunk(
  "map/fetchPlacesListByBBox",
  async (data = {}, thunkApi) => {
    try {
      const response = await placesListByBBox(data?.params, data?.apiKey);
      return response;
    } catch (error) {
      console.log("error",error)
      return thunkApi.rejectWithValue(error);
    }
  }
);
// Helpers
const handlePending = (state, key) => {
  state[key].loading = true;
  state[key].error = null;
};

const handleRejected = (state, action, key) => {
  state[key].loading = false;
  state[key].error = action.payload || "Error";
};
const mapSlice = createSlice({
  name: "map",
  initialState,
  reducers: {
    getUserLocation: (state, action) => {
      state.user.location = action?.payload;
    },
    getMapCenter: (state, action) => {
      state.mapCenter.location = action?.payload;
    },
    getMapInfo: (state, action) => {
      state.map.location = action?.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlacesListByBBox.pending, (state) => {
        handlePending(state, "placesOnMap");
      })
      .addCase(fetchPlacesListByBBox.fulfilled, (state, action) => {
        state.placesOnMap.loading = false;
        state.placesOnMap.data = action.payload?.data || [];
        state.placesOnMap.error = null;
      })
      .addCase(fetchPlacesListByBBox.rejected, (state, action) => {
        handleRejected(state, action, "placesOnMap");
      });
  },
});
export default mapSlice.reducer;
export let { getUserLocation, getMapCenter, getMapInfo } = mapSlice.actions;
