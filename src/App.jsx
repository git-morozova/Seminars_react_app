import { useReducer, useEffect } from "react";
import { reducer, initialState } from "../src/reducers/reducer";
import { FETCH_ACTIONS } from "./actions";

import axios from "axios";

const App = () => {

  const [state, dispatch] = useReducer(reducer, initialState);

  const { items, loading, error} = state;

  console.log(items, loading, error);

  useEffect(() => {
    dispatch({type: FETCH_ACTIONS.PROGRESS});

    const getItems = async () => {
      try{
        let response = await axios.get("http://localhost:3000/seminars");
        if (response.status === 200) {
          dispatch({type: FETCH_ACTIONS.SUCCESS, data: response.data});
        }
      } catch(err){
        console.error(err);
        dispatch({type: FETCH_ACTIONS.ERROR, error: err.message})
      }
    }

    getItems();

  }, []);


  return (
    <div className="flex flex-col m-8 w-2/5">
      {
        loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <ul>
            <h1>Seminars</h1>
            {
              items.map((item) => (
               
                <li                   
                  key={item.id}>

                  <p>
                    id: <strong>{item.id}</strong>
                  </p>
                  <p>
                    title: <strong>{item.title}</strong>
                  </p>
                  <p>
                    description: <strong>{item.description}</strong>
                  </p>
                  <p>
                    date: <strong>{item.date}</strong>
                  </p>
                  <p>
                    time: <strong>{item.time}</strong>
                  </p>
                  
                  <img src={item.photo}/>                 

                </li>
              ))
            }
            
          </ul>
        )
      }

    </div>
  )
}

export default App;