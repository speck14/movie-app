import React from "react";
import "./index.css";

function Checkbox({ name, id, index, isChecked, eventHandler }) {
  return (
    <div className="checkbox">
      <label htmlFor={name}>
        <input
          type="checkbox"
          id={name}
          name={name}
          value={id}
          checked={isChecked}
          onChange={() => eventHandler(index)}
        />
        {name} <b>{isChecked.toString()}</b>
      </label>
    </div>
  );
}

export default Checkbox;
