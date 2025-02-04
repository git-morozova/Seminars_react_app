import { FETCH_ACTIONS } from "../actions"
 /*
    дополнить функцию-редуктор логикой обновления состояния
*/

const initialState = {
  items: [],
  loading: false,
  error: null,
}

const reducer = (state, action) => {

  switch (action.type) {
    case FETCH_ACTIONS.PROGRESS: {
      return {
        ...state,
        loading: true,
      }
    }

    case FETCH_ACTIONS.SUCCESS: {
      return {
        ...state,
        loading: false,
        items: action.data,
      }
    }

    case FETCH_ACTIONS.ERROR: {
      return {
        ...state,
        loading: false,
        error: action.error,
      }
    }
    
    default: {
      return state;
    } 
  }

}

export {reducer, initialState};