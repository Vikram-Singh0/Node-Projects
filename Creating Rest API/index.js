const express = require("express");
// const users = require("./MOCK_DATA.json");
const fs = require("fs");
const mongoose = require("mongoose");
const { type } = require("os");

const app = express();
const PORT = 9000;

//Connecting from mongo db
mongoose
  .connect("mongodb://127.0.0.1:27017/demo-DB")
  .then(() => {
    console.log("MongoDb connected sucessfully");
  })
  .catch((err) => {
    console.log("mongo err", err);
  });

//Creating schema for users in mongoose

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    gender: {
      type: String,
     
    },
    age:{
      type:Number,
    }
  },
  { timestamps: true }
);

const user = mongoose.model("user", userSchema);

app.get("/users",  async(req, res) => {
  const allDbUsers=await user.find({})
  const html = `
  <ul>
  ${allDbUsers.map((user) => `<li> ${user.firstName}</li>`).join("")}
  </ul>

  `;
  return res.send(html);
});

//Midleware as plugins

app.use(express.urlencoded({ extended: false }));

// creating our middleware

app.use((req, res, next) => {
  console.log("Hello from midleware 1");
  next();
});

app.use((req, res, next) => {
  console.log("Hello from middleware 2");
  // return res.end("Fuck you")
  next();
});

// creating log file using middlewares
app.use((req, res, next) => {
  fs.appendFile(
    "./log.txt",
    `\n ${Date.now()}: ${req.method}: ${req.ip}:${req.path}`,
    (err, data) => {
      next();
    }
  );
});

//  Rest APIS

app.get("/api/users", async(req, res) => {
  const allDbUsers=await user.find({})
  res.setHeader("name", "vikram");
  console.log(req.headers);
  return res.json(allDbUsers);
});

app.get("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);

  const user = users.find((user) => user.id === id);
  // if(!user){
  //   req.status(404).json({status:'Not found'})
  // }
  return res.json(user);
});

app.post("/api/users",async (req, res) => {
  //Create a user
  const body = req.body;
  console.log("Body", body);

  if (!body.first_name || !body.last_name || !body.gender || !body.age ||!body.email) {
    return res.status(400).json({ msg: "all fields are required" });
  }
const final=await user.create({
  firstName:body.first_name,
  lastName:body.last_name,
  gender:body.gender,
  age:body.age,
  email:body.email
})
console.log(final)
return res.status(201).json({status:"Sucess"})
  // users.push({ ...body, id: users.length + 1 });
  // fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
  //   return res.status(201).json({ status: "Success", id: users.length + 1 });
  });
app.patch("/api/user/:id", async(req, res) => {
  //Edit an user
  await user.findByIdAndUpdate(req.params.id,{email:"changed@gmail"})

  return res.json({ status: "Sucess" });
});
app.delete("/api/user/:id", async(req, res) => {
  //Delete an user
  await user.findByIdAndDelete(req.params.id,{lastName})
  return res.json({ status: "Sucess" });
});

// The better way to write above code is to avoid repetition

app
  .route("/api/users/:id")
  .get((req, res) => {
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id);
    return res.json(user);
  })
  .post((req, res) => {
    //Create a user

    return res.json({ status: "pending" });
  })
  .patch((req, res) => {
    //Edit an user
    return res.json({ status: "Pending" });
  })
  .delete((req, res) => {
    //Delete an user
    return res.json({ status: "pending" });
  });

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
