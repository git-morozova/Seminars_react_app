import { FETCH_ACTIONS } from "../actions"

const initialState = {
  items: [],
  loading: false,
  error: null,
}

const reducer = (state, action) => {

// функция-редуктор работает с состоянием на основе типа экшена
  switch (action.type) {
    case FETCH_ACTIONS.PROGRESS: {
      return {
        ...state,
        loading: true, // для рендера лоадера
      }
    }

    case FETCH_ACTIONS.SUCCESS: {
      return {
        ...state,
        loading: false,
        items: action.data, // рендер данных, например полученных из БД
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