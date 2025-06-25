import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import citiesNearLocation from "../../api/search/citiesNearLocation";
import geocoding from "../../api/routing/geocoding";
import countryCodes from "../../api/search/countryCodes";

const initialState = {
  destination: { show: true, value: "", openSuggestedOptions: false },
  country: { show: false, value: null, label: null },
  category: { show: false, value: "other_hotels", label: "Hotels" },
  nearbyLocations: { data: [], error: null, loading: false },
  searchedLocations: { data: [], error: null, loading: false },
  countries: { data: [], error: null, loading: false },
};

// Async Thunks
export const fetchAllNearbyLocations = createAsyncThunk(
  "searchFilter/fetchAllNearbyLocations",
  async (data = {}, thunkApi) => {
    try {
      const response = await citiesNearLocation(
        data?.params,
        data?.apiKey,
        data?.latlng
      );
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const fetchAllSearchedLocations = createAsyncThunk(
  "searchFilter/fetchAllSearchedLocations",
  async (data, thunkApi) => {
    try {
      const response = await geocoding(data?.params, data?.apiKey);
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);
export const fetchAllCountries = createAsyncThunk(
  "searchFilter/fetchAllCountries",
  async (data, thunkApi) => {
    try {
      const response = await countryCodes();
      return response;
    } catch (error) {
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

// Slice
const searchFilterSlice = createSlice({
  name: "searchFilter",
  initialState,
  reducers: {
    // destination
    toggleShowDestination: (state) => {
      state.destination.show = !state.destination.show;
      state.destination.openSuggestedOptions = false;
      state.country.show = false;
      state.category.show = false;
    },
    selectDestination: (state, action) => {
      state.destination.value = action.payload?.value;
    },
    toggleShowSuggestedDestination: (state) => {
      state.destination.openSuggestedOptions =
        !state.destination.openSuggestedOptions;
    },
    closeSuggestedDestination: (state) => {
      state.destination.openSuggestedOptions = false;
    },

    // country
    toggleShowCountry: (state) => {
      state.country.show = !state.country.show;
      state.category.show = false;
      state.destination.show = false;
      state.destination.openSuggestedOptions = false;
    },
    selectCountry: (state, action) => {
      state.country.value = action.payload?.value;
      state.country.label = action.payload?.value;
    },

    // category
    toggleShowCategory: (state) => {
      state.category.show = !state.category.show;
      state.country.show = false;
      state.destination.show = false;
      state.destination.openSuggestedOptions = false;
    },
    selectCategory: (state, action) => {
      state.category.value = action.payload?.value;
      state.category.label = action.payload?.label;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchAllSearchedLocations.pending, (state) => {
        handlePending(state, "searchedLocations");
      })
      .addCase(fetchAllSearchedLocations.fulfilled, (state, action) => {
        state.searchedLocations.loading = false;
        state.searchedLocations.data = action.payload?.data?.results || [];
        state.searchedLocations.error = null;
      })
      .addCase(fetchAllSearchedLocations.rejected, (state, action) => {
        handleRejected(state, action, "searchedLocations");
      })

      .addCase(fetchAllNearbyLocations.pending, (state) => {
        handlePending(state, "nearbyLocations");
      })
      .addCase(fetchAllNearbyLocations.fulfilled, (state, action) => {
        state.nearbyLocations.loading = false;
        state.nearbyLocations.data = action.payload?.data?.data || [];
        state.nearbyLocations.error = null;
      })
      .addCase(fetchAllNearbyLocations.rejected, (state, action) => {
        handleRejected(state, action, "nearbyLocations");
      })
      .addCase(fetchAllCountries.pending, (state) => {
        handlePending(state, "countries");
      })
      .addCase(fetchAllCountries.fulfilled, (state, action) => {
        state.countries.loading = false;
        state.countries.data = action.payload?.data || [];
        state.countries.error = null;
      })
      .addCase(fetchAllCountries.rejected, (state, action) => {
        handleRejected(state, action, "countries");
      });
  },
});

export const {
  toggleShowDestination,
  selectDestination,
  toggleShowSuggestedDestination,
  closeSuggestedDestination,
  toggleShowCountry,
  selectCountry,
  toggleShowCategory,
  selectCategory,
} = searchFilterSlice.actions;

export default searchFilterSlice.reducer;
