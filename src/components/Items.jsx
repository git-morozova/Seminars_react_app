import { useReducer, useState, useEffect } from "react";
import { reducer, initialState } from "/src/reducers/reducer";
import { FETCH_ACTIONS } from "/src/actions";
import axios from "axios";

const Items = () => {

    const [state, dispatch] = useReducer(reducer, initialState);  
    let { items, loading, error} = state;    
    console.log(items, loading, error);    


    /*чтение списка из БД*/

    useEffect(() => {
      dispatch({type: FETCH_ACTIONS.PROGRESS});    

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


  

const [isModalOpen, setIsModalOpen] = useState(false)
const [modalContent, setModalContent] = useState('')
const [modalType, setModalType] = useState(false)

/* компонент модального окна */
const Modal = ({ isModalOpen, modalContent, modalType, onClose }) => {

  if (isModalOpen !== true) {
    return null;
  }  
  if (modalType == 'delete') { // функция удаления

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
            <button onClick={onClose}>Закрыть</button>
          </div>
          <main className="modal-mainContents">
            <h5 className="modal-title">Удалить семинар с id = {modalContent}?</h5>
            <div className="modal-button text-end">
              <button onClick={() => confirmDel()}>Да</button> 
            </div>
          </main>
        </article>
      </section>
    );

  }  else if (modalType == "edit") { // функция редактирования

    const confirmEdit = () => {
      axios.put('http://localhost:3000/seminars/' + modalContent.id, {
        id: modalContent.id,
        title: modalContent.title + "1",
        description: modalContent.description,
        date: modalContent.date,
        time: modalContent.time,
        photo: modalContent.photo
      })
      
      .then(response => {
          console.log('Item edited:', response.data);  

          let currebtId = modalContent.id;

          items = items.map(elem => {
            if (elem.id === currebtId) {
              return response.data;
            } else {
              return elem;
            }
          });
          
          
          console.log('Items refreshed');
          dispatch({type: FETCH_ACTIONS.SUCCESS, data: items});       
          setIsModalOpen(false);
      })

      .catch(error => {
          console.error('Error editing item:', error);
          dispatch({type: FETCH_ACTIONS.ERROR, error: error.message})
      });   

    }

    return (
      <section className="modal">
        <article className="modal-content p-lg-4">
          <div className="exit-icon text-end">
            <button onClick={onClose}>Закрыть</button>
          </div>
          <main className="modal-mainContents">
            <h5 className="modal-title">Сохранить изменения для семинара с id = {modalContent.id}?</h5>
            <div className="modal-button text-end">
              <button onClick={() => confirmEdit()}>Да</button> 
            </div>
          </main>
        </article>
      </section>
    );
  }
};


/*удаление элемента из БД*/  
function handleDelete(item) {  
  console.log('In delete item', item);
  setIsModalOpen(true);
  setModalContent(item.id);
  setModalType('delete');

};

/* редактирование элемента */  
function handleEdit(item) {  
  console.log('In edit item', item);
  setIsModalOpen(true);
  setModalContent(item);
  setModalType('edit');
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

                    <button onClick={ handleEdit.bind(this, item)}>Редактировать</button>&nbsp;

                    <button onClick={ handleDelete.bind(this, item)}>Удалить</button>                     

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
   modalType={modalType}
   onClose={closeModal}
 />
</section>
    </div>
  )
}

export default Items;