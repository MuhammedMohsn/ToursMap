import { configureStore } from "@reduxjs/toolkit";
import searchFilterSlice from "../features/search-filter-slice";
import mapSlice from "../features/map-Info-new-slice";
import routingSlice from "../features/routing";
export default configureStore({
  reducer: {
    searchFilter: searchFilterSlice,
    map: mapSlice,
    routing: routingSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
