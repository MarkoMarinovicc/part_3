import React from "react";

const Filter = ({searchItem, handleSearchChange}) => {
  return (
    <div>
      {" "}
      Search: <input value={searchItem} onChange={handleSearchChange} />
    </div>
  );
};

export default Filter;
