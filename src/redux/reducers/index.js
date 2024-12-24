import { combineReducers } from '@reduxjs/toolkit'
import authReducers from './authReducers'

const rootReducer = combineReducers({
  auth: authReducers
})

export default rootReducer