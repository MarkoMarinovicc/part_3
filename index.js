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

app.get("/api/persons", (request, response) => {
  Person.find({}).then((person) => {
    response.json(person);
  });
});
app.get("/info", async (request, response) => {
  const date = new Date().toString();
  const phonebookLenght = await Person.countDocuments();
  response.send(
    `<h1>Phonebook hase info for ${phonebookLenght}</h1></br><p>${date}</p>`
  );
});
app.get("/api/persons/:id", async (request, response) => {
  const person = await Person.findById(request.params.id);
  const phonebookLenght = await Person.countDocuments();
  if (phonebookLenght > 0) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});
app.delete("/api/persons/:id", async(request, response) => {
 const id=request.params.id
  const person = await Person.findByIdAndDelete(id);

  response.json(person);
});
app.post("/api/persons", async(request, response) => {
  //const body = request.body;
  const { name, number } = request.body
  if (!name && !number) {
    return response.status(400).json({ error: 'content missing' })
  }
  
  const person=await Person.insertMany({
    name,
    number
  })

  return response.json(person)


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
app.put("/api/persons/", async(request, response) => {
  const { name, number } = request.body;
  const person=await Person.findOneAndUpdate({name},{
    name,
    number
  },{
    new:true
  })
  response.json(person);
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
