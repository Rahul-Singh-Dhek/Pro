const express=require('express');
const mongoose=require('mongoose');
const urlModel=require('./models/urlModel.js')
const app=express()
const fs=require('file-system')
const IP=require('ip')

app.use(express.json())


mongoose.connect('mongodb+srv://RahulSinghDhek:IQpy326QQQKAkK2J@cluster0.dxzlfnc.mongodb.net/group2Database?retryWrites=true&w=majority')
.then(()=>{
    console.log("MongoDB is connected")
})
.catch((error)=>{
    console.log(error)
})

app.get("/testApi",(req,res)=>{
    return res.status(200).send({status:true,message:"App is working correctly."})
})


app.post("/createShort",async(req,res)=>{
    let uniqueNumber=new Date()*Math.random()
    let shortUrl=`http://localhost:3000/relocate/${uniqueNumber}`
    let savedData=await urlModel.create({urlCode:`${uniqueNumber}`,longUrl:req.body.longUrl ,shortUrl:shortUrl})
    return res.status(201).send({status:true,data:savedData})
})

app.get("/getRecent",async (req,res)=>{

    let date=new Date()
    date=date.setHours(date.getHours() - 1)

    let savedData=await urlModel.find({createdAt:{$lte:new Date(),$gt:date}})
    

    return res.status(200).send({status:true,data:savedData});
})

app.get("/relocate/:urlCode",async (req,res)=>{

    let data=await urlModel.findOne({urlCode:req.params.urlCode})

    console.log(IP.address())
    let obj={
        "IP Address":IP.address(),
        "Url Code":data.urlCode,
        "Hit Time":new Date()
    }
    let jsonContent = JSON.stringify(obj)
    fs.writeFile("output.json", jsonContent, 'utf8', function (err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }
     
        console.log("JSON file has been saved.");
    });
return res.redirect(data.longUrl)
})


app.listen (3000,()=>{
    console.log("Express is connected") 
})


