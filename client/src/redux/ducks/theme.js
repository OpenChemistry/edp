import { createAction, handleActions } from 'redux-actions';

// Selectors

export const getDarkMode = (state) => state.theme.darkMode;

// Actions
const ENABLE_DARK_MODE = 'ENABLE_DARK_MODE';

// Action creators
export const enableDarkMode = createAction(ENABLE_DARK_MODE);

// Reducer

const initialState = {
  darkMode: false
}

const reducer = handleActions({
  [enableDarkMode.toString()]: (state, action) => {
    return {...state, darkMode: action.payload};
  }
}, initialState);

export default reducer;
