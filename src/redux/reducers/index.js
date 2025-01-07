import { combineReducers } from '@reduxjs/toolkit'
import authReducers from './authReducers'
import searchReducers from './searchReducers';

const rootReducer = combineReducers({
  auth: authReducers,
  search: searchReducers,
})

export default rootReducer