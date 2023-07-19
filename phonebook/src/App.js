import { useEffect, useState } from "react";
import Filter from "./Filter";
import PersonForm from "./PersonForm";
import Persons from "./Persons";
import { client } from "./lib/axios";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchItem, setSearchItem] = useState("");
  const [requestSuccess, setRequestSuccess] = useState(false);
  const [addedPersons, setAddedPersons] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchPersons = () => {
    client
      .get("/api/persons")
      .then((res) => {
        setPersons(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchPersons();
  }, [requestSuccess]);

  const handleNameChange = (event) => {
    const { value } = event.target;
    setNewName(value);
  };

  const handleNumberChange = (event) => {
    const { value } = event.target;
    setNewNumber(value);
  };

  const handleSearchChange = (event) => {
    setSearchItem(event.target.value);
  };
  const validator = persons.find((person) => person.name === newName);
  const addPerson = async (event) => {
    event.preventDefault();

    if (validator) {
      if (
        window.confirm(
          `Do you want to update ${validator.name} number because you have his number allready`
        )
      ) {
        const personObject = {
          name: validator.name,
          number: newNumber,
        };
        await client
          .put(`/api/persons`, personObject)
          .then((res) => {
            setPersons((old) => [...old, res.data]);
            setRequestSuccess(true);
          })
          .catch((error) => {
            if (error.response && error.response.status === 404) {
              setErrorMessage(
                `Person '${validator.name}' was already deleted.`
              );
            }
          });
        setNewName("");
        setNewNumber("");
      }
    } else {
      const personObject = {
        name: newName,
        number: newNumber,
        id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      };
      await client.post("/api/persons", personObject).then((res) => {
        setPersons((old) => [...old, res.data]);
        setAddedPersons((old) => [...old, res.data]);
        setRequestSuccess(true);
        console.log(addedPersons);
      });

      setNewName("");
      setNewNumber("");
    }
  };
  const addClass = {
    color: "green",
    border: "1px solid green",
    padding: "5px",
    backgroundColor: "grey",
  };
  const errorClass = {
    color: "red",
    padding: "5px",
    border: "1px solid red",
    backgroundColor: "grey",
  };

  return (
    <div>
      <h2>Phonebook</h2>
      {addedPersons.length > 0 && (
        <p style={addClass}>You added {addedPersons[0].name}</p>
      )}
      {errorMessage && <p style={errorClass}>{errorMessage}</p>}

      <Filter searchItem={searchItem} handleSearchChange={handleSearchChange} />
      <PersonForm
        newName={newName}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        newNumber={newNumber}
        addPerson={addPerson}
      />
      <h2>Numbers</h2>
      <Persons
        persons={persons}
        searchItem={searchItem}
        setPersons={setPersons}
      />
    </div>
  );
};

export default App;
