const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(
  morgan(function (tokens, req, res) {
    let logTokens = [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
    ];

    if (req.method === "POST" && req.body) {
      logTokens.push(JSON.stringify(req.body));
    }

    return logTokens.join(" ");
  })
);
let phonebook = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (request, response) => {
  response.json(phonebook);
});
app.get("/info", (request, response) => {
  const date = new Date().toString();
  const phonebookLenght = phonebook.length;
  response.send(
    `<h1>Phonebooke hase info for ${phonebookLenght}</h1></br><p>${date}</p>`
  );
});
app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const phonebooks = phonebook.find((phonebook) => phonebook.id === id);
  if (phonebooks) {
    response.json(phonebooks);
  } else {
    response.status(404).end();
  }
});
app.delete("/api/phonebook/:id", (request, response) => {
  const id = Number(request.params.id);
  phonebook = phonebook.find((phonebook) => phonebook.id !== id);
  response.status(204).end();
});
app.post("/api/persons", (request, response) => {
  //const body = request.body;
  const id = phonebook.length > 0 ? Math.floor(Math.random() * 100) : 0;
  const { name, number } = request.body;
  if (!name && !number) {
    return response.status(400).json({
      error: "content missing",
    });
  }
  const validation = phonebook.find((x) => x.name === name);
  if (validation) {
    return response.status(400).json({
      error: "you have that name already",
    });
  }
  const person = {
    name,
    number,
  };
  person.id = id;
  phonebook = phonebook.concat(person);
  response.json(person);
});
app.put("/api/persons/", (request, response) => {
  const nameBody = request.body.name;
  const id = phonebook.length;
  const index = phonebook.findIndex((item) => item.name === nameBody);
  const { name, number } = request.body;
  const person = {
    name,
    number,
  };
  person.id = id;
  phonebook[index] = person;
  response.json(person);
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
