import reverseGeocoding from "../../api/routing/reverseGeocoding";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import geocoding from "../../api/routing/geocoding";
import routing from "../../api/routing/routing";
const initialState = {
  show: false,
  mode: "drive",
  markerPositionsOnMap: [],
  currentUserLocationDetails: { data: {}, loading: false, error: null },
  waypoints: [
    {
      point: "1",
      address: "",
      searchedLocations: { data: [], loading: false, error: null },
      showSuggestedPlaces: false,
    },
    {
      point: "2",
      address: "",
      searchedLocations: { data: [], loading: false, error: null },
      showSuggestedPlaces: false,
    },
  ],
  routingDetails: { data: null, loading: false, error: null },
};
export const fetchUserLocationDetails = createAsyncThunk(
  "routing/fetchUserLocationDetails",
  async (data = {}, thunkApi) => {
    try {
      const response = await reverseGeocoding(data?.params, data?.apiKey);
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);
export const fetchAllSearchedLocationsForWaypoint = createAsyncThunk(
  "routing/fetchAllSearchedLocationsForWaypoint",
  async (data, thunkApi) => {
    try {
      const response = await geocoding(data?.params, data?.apiKey);
      return { index: data?.index, value: response };
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);
export const fetchRoutingDetails = createAsyncThunk(
  "routing/fetchRoutingDetails",
  async (data = {}, thunkApi) => {
    try {
      const response = await routing(data?.params, data?.apiKey);
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);
const handlePending = (state, key) => {
  state[key].loading = true;
  state[key].error = null;
};

const handleRejected = (state, action, key) => {
  state[key].loading = false;
  state[key].error = action.payload || "Error";
};

const routingSlice = createSlice({
  name: "routing",
  initialState,
  reducers: {
    setShow: (state, action) => {
      state.show = action.payload;
    },
    setMode: (state, action) => {
      state.mode = action.payload;
    },
    setWaypoints: (state, action) => {
      state.waypoints = action?.payload;
    },
    setMarkerPositionsOnMap: (state, action) => {
      state.markerPositionsOnMap = action?.payload;
    },
    resetWaypoints: (state) => {
      state.waypoints = state.waypoints?.map((waypoint) => {
        return { ...waypoint, address: "" };
      });
    },
    setShowSuggestedPlaces: (state, action) => {
      const { index, value } = action.payload;
      state.waypoints[index].showSuggestedPlaces = value;
    },
    clearWayPoint: (state, action) => {
      state.waypoints = state.waypoints.map((waypoint, index) => {
        if (index === action.payload) {
          return { ...waypoint, address: "" };
        } else {
          return waypoint;
        }
      });
    },
    resetRoutingDetails: (state) => {
      state.routingDetails = { data: null, loading: false, error: null };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserLocationDetails.pending, (state) => {
        handlePending(state, "currentUserLocationDetails");
      })
      .addCase(fetchUserLocationDetails.fulfilled, (state, action) => {
        state.currentUserLocationDetails.loading = false;
        state.currentUserLocationDetails.data = action.payload || {};
        state.currentUserLocationDetails.error = null;
      })
      .addCase(fetchUserLocationDetails.rejected, (state, action) => {
        handleRejected(state, action, "currentUserLocationDetails");
      })
      .addCase(
        fetchAllSearchedLocationsForWaypoint.pending,
        (state, action) => {
          const { index } = action.meta.arg;
          state.waypoints[index].searchedLocations.loading = true;
          state.waypoints[index].searchedLocations.error = null;
        }
      )
      .addCase(
        fetchAllSearchedLocationsForWaypoint.fulfilled,
        (state, action) => {
          const { index, value } = action.payload;
          state.waypoints[index].searchedLocations.loading = false;
          state.waypoints[index].searchedLocations.data =
            value?.data?.results || [];
          state.waypoints[index].searchedLocations.error = null;
        }
      )
      .addCase(
        fetchAllSearchedLocationsForWaypoint.rejected,
        (state, action) => {
          const { index } = action.meta.arg;
          state.waypoints[index].searchedLocations.loading = false;
          state.waypoints[index].searchedLocations.error = "error";
        }
      )
      .addCase(fetchRoutingDetails.pending, (state) => {
        handlePending(state, "routingDetails");
      })
      .addCase(fetchRoutingDetails.fulfilled, (state, action) => {
        state.routingDetails.loading = false;
        state.routingDetails.data = action?.payload?.data;
        state.routingDetails.error = null;
      })
      .addCase(fetchRoutingDetails.rejected, (state, action) => {
        handleRejected(state, action, "routingDetails");
      });
  },
});

export default routingSlice.reducer;
export const {
  setShow,
  setMode,
  setWaypoints,
  setShowSuggestedPlaces,
  resetWaypoints,
  clearWayPoint,
  setMarkerPositionsOnMap,
  resetRoutingDetails,
} = routingSlice.actions;
