import { useReducer, useState, useEffect } from "react";
import { reducer, initialState } from "/src/reducers/reducer";
import { FETCH_ACTIONS } from "/src/actions";
import axios from "axios";

// для алертов
import { toast } from 'react-custom-alert';
import 'react-custom-alert/dist/index.css'

// для инпута с выбором даты
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// картинки и доп.стили
import loaderGif from '/src/img/loader.gif';
import placeholderImg from '/src/img/placeholder.jpg';
import '/src/css/modals.css'


const Items = () => {
  const [state, dispatch] = useReducer(reducer, initialState); // получение значения стейт + dispatch
  let { items, loading, error } = state; // свойства объекта состояния - деструктурируем их
  //console.log(items, loading, error);  


  // ЧТЕНИЕ СПИСКА ИЗ БД
  useEffect(() => {
    dispatch({ type: FETCH_ACTIONS.PROGRESS }); // задаем экшн PROGRESS для отображения лоадера

    const getFromDataBase = async () => {
      try {
        let response = await axios.get("http://localhost:3000/seminars"); // запрос get в БД

        if (response.status === 200) { // заголовок ответа - ОК          
          setTimeout(() => { // имитируем долгую загрузку, чтобы посмотреть на лоадер
            dispatch({ type: FETCH_ACTIONS.SUCCESS, data: response.data }); 
          }, 2000)
        }
      } catch (err) { // ловим ошибки
        toast.error("Ошибка загрузки"); // toast - это алерты
        dispatch({ type: FETCH_ACTIONS.ERROR, error: err.message })
      }
    }

    getFromDataBase();
  }, []);
  // END - ЧТЕНИЕ СПИСКА ИЗ БД


  // КОМПОНЕНТ МОДАЛЬНОГО ОКНА 
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalContent, setModalContent] = useState('')
  const [modalType, setModalType] = useState(false)

  const Modal = ({ isModalOpen, modalContent, modalType, onClose }) => {
    if (isModalOpen !== true) {
      return null;
    }
    // УДАЛЕНИЕ ЗАПИСИ ИЗ БД    
    if (modalType == 'delete') { // первый тип модального окна (передается параметром) - 'delete'

      const confirmDel = async () => {
        try {
          let response = await axios.delete('http://localhost:3000/seminars/' + modalContent); // запрос
          if (response.status === 200) { // успешно
            
            items = items.filter(x => { // обновим состояние items
              return x.id != modalContent;
            })

            dispatch({ type: FETCH_ACTIONS.SUCCESS, data: items });
            setIsModalOpen(false);
            toast.success("Семинар удален");
          }
        } catch (err) { // ошибка
          setIsModalOpen(false);
          toast.error("Ошибка удаления");
          dispatch({ type: FETCH_ACTIONS.ERROR, data: items });
        }
      }

      // рендер модального окна 'delete'
      return (
        <section className="modal">
          <article className="modal-content">
            <p className="modal-title">Вы уверены, что хотите удалить семинар?</p>
            <div className="modal-buttons">
              <button onClick={() => confirmDel()}>Удалить</button>
              <button onClick={onClose}>Отмена</button>
            </div>
          </article>
        </section>
      );
      // END - УДАЛЕНИЕ ЗАПИСИ ИЗ БД

    } else if (modalType == "edit") { // второй тип модального окна - 'edit'

      // РЕДАКТИРОВАНИЕ ЗАПИСИ
      const [newDateInput, setNewDateInput] = useState(new Date());

      const confirmEdit = async () => {
        try {
          // записываем значения из инпутов в переменные
          let newTitle = document.querySelector("#newTitle");
          let newDescription = document.querySelector("#newDescription");
          let newDate = document.querySelector("#newDate");
          let newTime = document.querySelector("#newTime");
          let newPhoto = document.querySelector("#newPhoto");

          // уберем красную рамку при вводе в инпут, если ранее была подсветка с ошибкой ввода                  
          function clearInputError (inputBlock) {
            inputBlock.oninput = function() {
              inputBlock.classList.remove('input-error');
            };
          };
          clearInputError(newTitle);
          clearInputError(newDescription);
          clearInputError(newDate);
          clearInputError(newTime);          

          // валидация полей - проверка на пустые значения
          function validationInput (inputBlock) {
            if (!inputBlock.value) {
              inputBlock.classList.add('input-error');
              switch (inputBlock) {
                case newTitle: toast.error("Пожалуйста, введите название семинара")
                break
                case newDescription: toast.error("Пожалуйста, введите описание")
                break
                case newDate: toast.error("Пожалуйста, введите дату")
                break
                case newTime: toast.error("Пожалуйста, введите время")
                break
              };
              return false
            } else { 
              return true 
            } 
          };

          // валидация прошла
          if (validationInput(newTitle) && validationInput(newDescription) && validationInput(newDate) && validationInput(newTime) ){
           
            if (!newPhoto.value) {
              newPhoto.value = placeholderImg //картинка-плейсхолдер, если нет ссылки
            }

            // делаем запрос
            let response = await axios.put('http://localhost:3000/seminars/' + modalContent.id, {
              id: modalContent.id,
              title: newTitle.value,
              description: newDescription.value,
              date: newDate.value,
              time: newTime.value,
              photo: newPhoto.value
            })

            if (response.status === 200) { // успех

              // обновим состояние items
              let currebtId = modalContent.id;

              items = items.map(elem => {
                if (elem.id === currebtId) {
                  return response.data;
                } else {
                  return elem;
                }
              });

              dispatch({ type: FETCH_ACTIONS.SUCCESS, data: items });
              setIsModalOpen(false);
              toast.success("Семинар обновлен");
            }
          }
        } catch (err) { // ловим ошибки
          setIsModalOpen(false);
          toast.error("Ошибка сохранения");
          dispatch({ type: FETCH_ACTIONS.ERROR, data: items })
        }
      }

      // рендер модального окна 'edit'
      return (
        <section className="modal">
          <article className="modal-content">

            <label htmlFor="newTitle">
              Тема:<span>*</span>
            </label>
            <input id="newTitle" type="text" defaultValue={modalContent.title} />

            <label htmlFor="newDescription">
              Описание:<span>*</span>
            </label>
            <textarea id="newDescription" defaultValue={modalContent.description} />

            <label htmlFor="newDate">
              Дата:<span>*</span>
            </label>
            <DatePicker id="newDate" selected={newDateInput} dateFormat="dd.MM.yyyy" onChange={(date) => setNewDateInput(date)} />

            <label htmlFor="newTime">
              Время:<span>*</span>
            </label>
            <input id="newTime" type="time" defaultValue={modalContent.time} />

            <label htmlFor="newPhoto">
              Фото:
            </label>
            <input id="newPhoto" type="text" defaultValue={modalContent.photo} />

            <div className="modal-buttons">
              <button onClick={() => confirmEdit()}>Сохранить</button>
              <button onClick={onClose}>Отмена</button>
            </div>
          </article>
        </section>
      );
      // END - РЕДАКТИРОВАНИЕ ЗАПИСИ
    }
  };
  // END - КОМПОНЕНТ МОДАЛЬНОГО ОКНА

  // ЗАДАЕМ СТЕЙТЫ ДЛЯ МОДАЛЬНОГО ОКНА
  function handleDelete(item) {
    setIsModalOpen(true);
    setModalContent(item.id);
    setModalType('delete');

  };

  function handleEdit(item) {
    setIsModalOpen(true);
    setModalContent(item);
    setModalType('edit');
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  // END - ЗАДАЕМ СТЕЙТЫ ДЛЯ МОДАЛЬНОГО ОКНА

  
  // РЕНДЕР ОСНОВНОГО КОМПОНЕНТА
  // показываем лоадер, если значение свойства загрузки состояния равно true
  return (
    <>
      {
        loading ? (
          <img src={loaderGif} className="loaderImg" />
        ) : error ? (
          <p>{error}</p>
        ) : (
          <>
            <h1>Семинары</h1>
            <section >
              {
                items.map((item) => (

                  <article
                    key={item.id} id={item.id} className="seminar-container">

                    <div className="seminar-info">
                      <h2>
                        {item.title}
                      </h2>
                      <p>
                        <strong>Описание:</strong> {item.description}
                      </p>
                      <p>
                        <strong>Дата:</strong> {item.date}
                      </p>
                      <p>
                        <strong>Время:</strong> {item.time}
                      </p>
                    </div>

                    <img src={item.photo} className="seminar-photo" alt="Пожалуйста, включите VPN" />

                    <div className="seminar-buttons">

                      <button onClick={handleEdit.bind(this, item)} >
                        Редактировать
                      </button>

                      <button onClick={handleDelete.bind(this, item)}>
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
  // END - РЕНДЕР ОСНОВНОГО КОМПОНЕНТА
}

export default Items;