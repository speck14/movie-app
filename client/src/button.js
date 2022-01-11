import React from "react";

function Button({ styleClass, clickHandler, text }) {
  return <button onClick={clickHandler}>{text}</button>;
}

export default Button;
