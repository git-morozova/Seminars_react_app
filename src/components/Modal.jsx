import React from "react";
import { useReducer, useState, useEffect } from "react";
import { reducer, initialState } from "/src/reducers/reducer";
import { FETCH_ACTIONS } from "/src/actions";
import axios from "axios";

  const handleDelete = (itemId)=> {
    console.log('In delete item', itemId);

/* 1 - модалка "вы уверены?" */


const [state, dispatch] = useReducer(reducer, initialState);  
let { items, loading, error} = state;    
console.log(items, loading, error);    
  
useEffect(() => {
  dispatch({type: FETCH_ACTIONS.PROGRESS});

  /*чтение списка из БД*/
  


  axios.delete('http://localhost:3000/seminars/' + itemId)

  .then(response => {
      console.log('Item deleted:', response.data); 
      items = items.filter(x => {
        return x.id != itemId;
      })
      console.log('Items refreshed');
      dispatch({type: FETCH_ACTIONS.SUCCESS, data: items});
  })

  .catch(error => {
      console.error('Error deleting item:', error);
      dispatch({type: FETCH_ACTIONS.ERROR, error: error.message})
  });
       
  

}, []);  
}  
const Modal = ({ isModalOpen, modalContent, onClose }) => {
  if (isModalOpen !== true) {
    return null;
  }
  return (
    <section className="modal">
      <article className="modal-content p-lg-4">
        <div className="exit-icon text-end">
          <button onClick={onClose}>Close</button>
        </div>
        <main className="modal-mainContents">
          <h5 className="modal-title">Удалить {modalContent}?</h5>
          <hr />
          <div className="modal-image text-center mt-lg-2">
            <img alt="image" />
          </div>
          <div className="modal-button text-end">
            <button onClick={ handleDelete(modalContent)} >Ок </button>
          </div>
        </main>
      </article>
    </section>
  );
 };


export default Modal;