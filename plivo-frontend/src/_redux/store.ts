import {  applyMiddleware, legacy_createStore as createStore, type AnyAction } from "redux";
import  { thunk, type ThunkDispatch } from "redux-thunk";

import rootReducer from "./reducers";

export type RootState = ReturnType<typeof rootReducer>;

// Define your Dispatch type for actions
//void is the extra args which is not used in our case
export type AppDispatch = ThunkDispatch<RootState, null, AnyAction>;

// Create the store with the middleware
export const store = createStore(rootReducer, applyMiddleware(thunk));
