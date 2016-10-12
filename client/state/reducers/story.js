import * as ActionTypes from '../actions'
import { createReducer } from '../util.js';

const initialState = {
  isFetching: false,
  isError: false
}

export default createReducer(initialState, { 
  // [ActionTypes.STORY_REQUEST]: (state, payload) => {
  //   return Object.assign({}, state, {
  //     isFetching: true,
  //     isError: false
  //   })
  // },
  // [ActionTypes.STORY_SUCCESS]: (state, payload) => {
  //   return Object.assign({}, state, {
  //     isFetching: false
  //   })
  // },
  // [ActionTypes.STORY_FAILURE]: (state, payload) => {
  //   return Object.assign({}, state, {
  //     isFetching: false
  //   })
  // },
  [ActionTypes.UPLOAD_STORY_REQUEST]: (state, payload) => {
    return Object.assign({}, state, {
      isFetching: true
    })
  },
  [ActionTypes.UPLOAD_STORY_SUCCESS]: (state, payload) => {
    return Object.assign({}, state, {
      isFetching: false
    })
  },
  [ActionTypes.UPLOAD_STORY_FAILURE]: (state, payload) => {
    return Object.assign({}, state, {
      isFetching: false
    })
  }
})