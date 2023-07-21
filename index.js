require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/persons.js");

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

app.get("/api/persons", (request, response, next) => {
  Person.find({})
    .then((person) => {
      response.json(person);
    })
    .catch((error) => next(error));
});
app.get("/info", async (request, response, next) => {
  const date = new Date().toString();
  const phonebookLenght = await Person.countDocuments().catch((error) =>
    next(error)
  );
  response.send(
    `<h1>Phonebook has info for ${phonebookLenght}</h1></br><p>${date}</p>`
  );
});
app.get("/api/persons/:id", async (request, response, next) => {
  const phonebookLenght = await Person.countDocuments();
  await Person.findById(request.params.id)
    .then((person) => {
      if (phonebookLenght > 0) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});
app.delete("/api/persons/:id", async (request, response, next) => {
  const id = request.params.id;
  const person = await Person.findByIdAndDelete(id).catch((error) =>
    next(error)
  );

  response.json(person);
});
app.post("/api/persons", async (request, response, next) => {
  //const body = request.body;
  const { name, number } = request.body;
  if (!name && !number) {
    return response.status(400).json({ error: "content missing" });
  }

  const person = await Person.create({
    name,
    number,
  }).catch((error) => next(error));

  return response.json(person);

  // if (!name && !number) {
  //   return response.status(400).json({
  //     error: "content missing",
  //   });
  // }
  // const validation = phonebook.find((x) => x.name === name);
  // if (validation) {
  //   return response.status(400).json({
  //     error: "you have that name already",
  //   });
  // }
  // const person = {
  //   name,
  //   number,
  // };
  // person.id = id;
  // phonebook = phonebook.concat(person);
  // response.json(person);
});
app.put("/api/persons/", async (request, response, next) => {
  const { name, number } = request.body;
  const person = await Person.findOneAndUpdate(
    { name },
    {
      name,
      number,
    },
    {
      new: true,
    }
  ).catch((error) => next(error));
  response.json(person);
});
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler);

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
