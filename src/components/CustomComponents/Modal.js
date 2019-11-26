import "../../css/modal.css";
import React from "react";
const Modal = ({ handleClose, show, children, closeDisplay }) => {

  return (
    <div className={show ? "modal display-block" : "modal display-none"}>
      
      <section className="modal-main modal-rm-cnf">
        <span onClick={handleClose} className={closeDisplay === "none" ? "display-none" : "x-btn"}>&times;</span>
        {children}
      </section>
    </div>
  );
};

export default Modal;