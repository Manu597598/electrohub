import userSlice from "./userSlice"
import productSlice from "./productSlice"
import { combineReducers, configureStore } from "@reduxjs/toolkit"
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist"
import storage from "redux-persist/lib/storage"

const persistConfig = {
  key: "Electrohub",
  version: 1,
  storage,
}

const rootReducer = combineReducers({
  user: userSlice, 
  product: productSlice,  // 👈 state.user.user
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoreActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
        ],
      },
    }),
})

export default store
