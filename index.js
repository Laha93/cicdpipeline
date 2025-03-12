const express= require("express")
const app=express();
const PORT = process.env.PORT || 3000 

const users =[{id:1,name:"John"},{id:2,name:"ALice"}]
const orders =[{id:101,name:"Iphone"},{id:102,name:"Laptop"}]

app.get("/users",(req,res)=>{
    res.json(users);
})
app.get("/orders",(req,res)=>{
    res.json(orders)
})
app.get("/",(req,res)=>{
    res.json({message:"hello from microservice 1"})
})

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
    
})