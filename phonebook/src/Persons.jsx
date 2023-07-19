import React from "react";
import { client } from "./lib/axios";

const Persons = ({ persons, searchItem, setPersons }) => {
  const deletePerson = (event, id) => {
    if (window.confirm("Do you really want to delete?")) {
      client.delete(`/api/phonebook/${id}`).then(() => {
        setPersons((old) => old.filter((person) => person.id !== id));
      });
    }
  };

  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(searchItem.toLowerCase())
  );

  return (
    <div>
      {filteredPersons.map((person) => (
        <div key={person.id}>
          {person.name} {person.number}{" "}
          <button onClick={(event) => deletePerson(event, person.id)}>
            {" "}
            DELETE
          </button>
        </div>
      ))}
    </div>
  );
};

export default Persons;
