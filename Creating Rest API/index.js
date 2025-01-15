const express = require("express");
const users = require("./MOCK_DATA.json");
const fs=require('fs')

const app = express();
const PORT = 9000;

app.get("/users", (req, res) => {
  const html = `
  <ul>
  ${users.map((user) => `<li> ${user.first_name}</li>`).join("")}
  </ul>

  `;
  return res.send(html);
});

//Midleware as plugins


app.use(express.urlencoded ({extended:false}))


// creating our middleware

app.use((req,res,next)=>{
  console.log("Hello from midleware 1")
  next()
})

app.use((req,res,next)=>{
  console.log("Hello from middleware 2")
  // return res.end("Fuck you")
  next()
})

// creating log file using middlewares
app.use((req,res,next)=>{
  fs.appendFile('./log.txt',`\n ${Date.now()}: ${req.method}: ${req.ip}:${req.path}`,(err,data)=>{
    next()
  })
})


//  Rest APIS

app.get("/api/users", (req, res) => {
  return res.json(users);
});

app.get("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const user = users.find((user) => user.id === id);
  return res.json(user);
});

app.post("/api/users", (req, res) => {
  //Create a user
  const body=req.body
  console.log("Body",body)

  users.push({...body,id:users.length+1})
  fs.writeFile('./MOCK_DATA.json',JSON.stringify(users),(err,data)=>{
    if(err){
      console.log("Error",err)
    }
return res.json({status:"Success",id:users.length+1})
  })
  return res.json({ status: "pending" });
});
app.patch("/api/user/:id", (req, res) => {
  //Edit an user
  return res.json({ status: "Pending" });
});
app.delete("/api/user/:id", (req, res) => {
  //Delete an user
  return res.json({ status: "pending" });
});



// The better way to write above code is to avoid repetition



app.route("/api/users/:id")
  .get( (req, res) => {
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id);
    return res.json(user);
  })
  .post( (req, res) => {
    //Create a user
   
    return res.json({ status: "pending" });
  })
  .patch( (req, res) => {
    //Edit an user
    return res.json({ status: "Pending" });
  })
  .delete( (req, res) => {
    //Delete an user
    return res.json({ status: "pending" });
  });

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
