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
          onChange={eventHandler}
        />
        {name}
      </label>
    </div>
  );
}

export default Checkbox;
