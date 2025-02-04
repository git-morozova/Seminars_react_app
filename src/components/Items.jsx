import { useReducer, useState, useEffect } from "react";
import { reducer, initialState } from "/src/reducers/reducer";
import { FETCH_ACTIONS } from "/src/actions";
import axios from "axios";

const Items = () => {

    const [state, dispatch] = useReducer(reducer, initialState);  
    let { items, loading, error} = state;    
    console.log(items, loading, error);    
      
    useEffect(() => {
      dispatch({type: FETCH_ACTIONS.PROGRESS});
    
      /*чтение списка из БД*/
      const getFromDataBase = async () => {
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
    
      getFromDataBase();     

    }, []); 










/* модалка */
const [isModalOpen, setIsModalOpen] = useState(false)
const [modalContent, setModalContent] = useState('')

const Modal = ({ isModalOpen, modalContent, onClose }) => {
  if (isModalOpen !== true) {
    return null;
  }   
  const confirmDel = () => {

    axios.delete('http://localhost:3000/seminars/' + modalContent)

    .then(response => {
        console.log('Item deleted:', response.data); 
        items = items.filter(x => {
          return x.id != modalContent;
        })
        console.log('Items refreshed');
        dispatch({type: FETCH_ACTIONS.SUCCESS, data: items});       
        setIsModalOpen(false);
    })

    .catch(error => {
        console.error('Error deleting item:', error);
        dispatch({type: FETCH_ACTIONS.ERROR, error: error.message})
    });
    

  }
  return (
    <section className="modal">
      <article className="modal-content p-lg-4">
        <div className="exit-icon text-end">
          <button onClick={onClose}>Close</button>
        </div>
        <main className="modal-mainContents">
          <h5 className="modal-title">Удалить {modalContent}?</h5>
          <div className="modal-button text-end">
            <button onClick={() => confirmDel()}>Ok</button> 
          </div>
        </main>
      </article>
    </section>
  );
  
};
   

/*удаление элемента из БД*/    

function handleDelete(itemId) {  
  console.log('In delete item', itemId);
  setIsModalOpen(true);
  setModalContent(itemId);
};

const closeModal = () => {
  setIsModalOpen(false);
};


  return (
    <div>
      {
        loading ? (
          <p>Загрузка...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <ul>
            {
              items.map((item) => (
               
                <li                   
                  key={item.id}>

                  <p>
                    id: <strong>{item.id}</strong>
                  </p>
                  <p>
                    Тема: <strong>{item.title}</strong>
                  </p>
                  <p>
                    Описание: <strong>{item.description}</strong>
                  </p>
                  <p>
                    Дата: <strong>{item.date}</strong>
                  </p>
                  <p>
                    Время: <strong>{item.time}</strong>
                  </p>
                  
                  <img src={item.photo}/>  <br/>                   

                    <button>Редактировать</button>&nbsp;

                    <button onClick={ handleDelete.bind(this, item.id)}>Удалить</button>                     

                </li>
              ))
            }
            
          </ul>
        )
      }

<section>
 <Modal
   isModalOpen={isModalOpen}
   modalContent={modalContent}
   onClose={closeModal}
 />
</section>;
    </div>
  )
}

export default Items;