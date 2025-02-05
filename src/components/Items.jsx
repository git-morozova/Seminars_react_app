import { useReducer, useState, useEffect } from "react";
import { reducer, initialState } from "/src/reducers/reducer";
import { FETCH_ACTIONS } from "/src/actions";
import axios from "axios";
import { toast } from 'react-custom-alert';
import 'react-custom-alert/dist/index.css'
import loaderGif from '/src/img/loader.gif';
import '/src/css/modals.css'

const Items = () => {
  const [state, dispatch] = useReducer(reducer, initialState);  
  let { items, loading, error} = state;    
  //console.log(items, loading, error);  


  /*чтение списка из БД*/
  useEffect(() => {
    dispatch({type: FETCH_ACTIONS.PROGRESS});   

    const getFromDataBase = async () => {
      try{
        let response = await axios.get("http://localhost:3000/seminars");

        if (response.status === 200) {
          //имитируем долгую загрузку, чтобы посмотреть на лоадер
          setTimeout(() => {
            dispatch({type: FETCH_ACTIONS.SUCCESS, data: response.data});
          }, 2000)          
        }
      } catch(err){
        toast.error("Ошибка загрузки");
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

      const confirmDel = async () => {
        try{
          let response = await axios.delete('http://localhost:3000/seminars/' + modalContent);
          if (response.status === 200) {

            //обновим состояние items
            items = items.filter(x => {
              return x.id != modalContent;
            })
            
            dispatch({type: FETCH_ACTIONS.SUCCESS, data: items});       
            setIsModalOpen(false);
            toast.success("Семинар удален");
          }
        } catch(err){
          setIsModalOpen(false);      
          toast.error("Ошибка удаления");
          dispatch({type: FETCH_ACTIONS.ERROR, data: items});
        }         

      }

      return (
        <section className="modal">
          <article className="modal-content p-lg-4">
            <main className="modal-mainContents">
              <p className="modal-title">Вы уверены, что хотите удалить семинар?</p>
              <div className="modal-button text-end">
                <button onClick={() => confirmDel()}>Удалить</button> 
              </div>              
              <div className="exit-icon text-end">
                <button onClick={onClose}>Отмена</button>
              </div>
            </main>
          </article>
        </section>
      );

    }  else if (modalType == "edit") { // функция редактирования

      const confirmEdit = async () => {
        try{        
 
          // сюда переменные из инпутов
          let newTitle = document.querySelector("#newTitle").value;
          let newDescription = document.querySelector("#newDescription").value;
          let newDate = document.querySelector("#newDate").value;
          let newTime = document.querySelector("#newTime").value;
          let newPhoto = document.querySelector("#newPhoto").value;
  
          // запрос
          let response = await axios.put('http://localhost:3000/seminars/' + modalContent.id, {
            id: modalContent.id,
            title: newTitle,
            description: newDescription,
            date: newDate,
            time: newTime,
            photo: newPhoto
          })

          if (response.status === 200) {
            let currebtId = modalContent.id;

            // обновим состояние items
            items = items.map(elem => {
              if (elem.id === currebtId) {
                return response.data;
              } else {
                return elem;
              }
            });            
            
            dispatch({type: FETCH_ACTIONS.SUCCESS, data: items});       
            setIsModalOpen(false);
            toast.success("Семинар обновлен");
          }
        } catch(err){
          setIsModalOpen(false); 
          toast.error("Ошибка сохранения");
          dispatch({type: FETCH_ACTIONS.ERROR, data: items})
        }    
      }

      return (
        <section className="modal">
          <article className="modal-content p-lg-4">
            <main className="modal-mainContents">

              <label>
                Тема: <input id="newTitle" type="text" defaultValue={modalContent.title}/>
              </label>
              <label>
                Описание: <input id="newDescription" type="text" defaultValue={modalContent.description}/>
              </label>
              <label>
                Дата: <input id="newDate" type="text" defaultValue={modalContent.date}/>
              </label>
              <label>
                Время: <input id="newTime" type="text" defaultValue={modalContent.time}/>
              </label>
              <label>
                Фото: <input id="newPhoto" type="text" defaultValue={modalContent.photo}/>
              </label>

              <div className="modal-button text-end">
                <button onClick={() => confirmEdit()}>Сохранить</button> 
              </div>
              <div className="exit-icon text-end">
              <button onClick={onClose}>Отмена</button>
            </div>
            </main>
          </article>
        </section>        
      );
    }
  };


  /*удаление элемента из БД*/  
  function handleDelete(item) {  
    setIsModalOpen(true);
    setModalContent(item.id);
    setModalType('delete');

  };

  /* редактирование элемента */  
  function handleEdit(item) {  
    setIsModalOpen(true);
    setModalContent(item);
    setModalType('edit');
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };


  return (
    <>
      {
        loading ? (
          <img src={loaderGif} className="loaderImg"/>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <> 
          <h1>Семинары</h1>
          <section >
              {
                items.map((item) => (
                
                  <article                   
                    key={item.id} id={item.id}  className="seminar-container">

                    <div className="seminar-info">
                      <h2>
                         {item.title}
                      </h2>
                      <p>
                        Описание: <strong>{item.description}</strong>
                      </p>
                      <p>
                        Дата: <strong>{item.date}</strong>
                      </p>
                      <p>
                        Время: <strong>{item.time}</strong>
                      </p>
                    </div>
                    
                    <img src={item.photo} className="seminar-photo"/>  
                    
                    <div className="seminar-buttons">         

                      <button onClick={ handleEdit.bind(this, item)} >
                        Редактировать
                      </button>

                      <button onClick={ handleDelete.bind(this, item)}>
                        <span>Удалить</span>
                      </button>                     
                    </div>  

                  </article>
                ))
              }              
          </section>
          </>
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

    </>
  )
}

export default Items;