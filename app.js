const express = require('express');
const app = express();

const mongo = require('mongodb');
const mongoClient = mongo.MongoClient;
const mongoUrl = "mongodb+srv://aliyaan:@123@cluster0.ktoi9.mongodb.net/Edureka?retryWrites=true&w=majority"
const port = process.env.PORT || 9900;

const cors = require('cors');

const chalk = require('chalk');
const morgan = require('morgan');
const fs = require('fs');
const bodyParser = require('body-parser');


const dbName = "edureka";
let dbo;
// using body-parser
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(cors())

app.use(morgan('tiny', {
    stream: fs.createWriteStream('mylogs.logs', {flags:'a'})
}))
// location
app.get('/location', (req,res)=>{
    dbo.collection('city').find({}).toArray((err,result)=>{
        if (err) throw err;
        res.send(result);
    })
})

// restaurant
app.get('/restaurant', (req,res)=>{
    var query= {};
    // restaurant on the basis of city and mealtype
    if(req.query.city && req.query.mealtype)
    query = {'city':req.query.city, 'type.mealtype':req.query.mealtype}
    // restaurant on basis of city
    else if(req.query.city)
        query = {'city': req.query.city};
    // restaurant on the basis of mealtype
    else if(req.query.mealtype)
        query = {"type.mealtype":req.query.mealtype}
        
    
    dbo.collection('restaurant').find(query).toArray((err,result)=>{
        if (err) throw err;
        res.send(result);
    })
})

// restaurant listing page
app.get('/restaurantlist/:mealtype', (req,res)=>{
    var query = {"type.mealtype":req.params.mealtype};
    var sort = {cost:-1}
    if(req.query.city, req.query.sort){
        query = {'type.mealtype':req.params.mealtype, 'city':req.query.city}
        sort = {cost:req.query.sort}
    }
    else if(req.query.cuisine, req.query.sort){
        query = {'type.mealtype':req.params.mealtype, 'Cuisine.cuisine':req.query.cuisine}
        sort = {cost:req.query.sort}
    }
    else if(req.query.cost, req.query.sort){
        query = {'type.mealtype':req.params.mealtype, 'cost':{$lt:req.query.lcost, $gt:req.query.hcost}}
        sort = {cost:req.query.sort}
    }
    else if(req.query.city){
        query = {'type.mealtype':req.params.mealtype, 'city':req.query.city}
        
    }
    else if(req.query.cuisine){
        query = {'type.mealtype':req.params.mealtype, 'Cuisine.cuisine':req.query.cuisine}
        
    }
    else if(req.query.cost){
        query = {'type.mealtype':req.params.mealtype, 'cost': {$gt:parseInt(req.query.lcost), $lt:parseInt(req.query.hcost)}}
    }
    dbo.collection('restaurant').find(query).toArray((err,result)=>{
        if (err) throw err;
        res.send(result);
    })
    })
    
    

// restaurant Details page

app.get('/restaurantDetails/:id', (req,res)=>{
    console.log(req.params.id);
    var query = {_id:req.params.id};
    dbo.collection('restaurant').find(query).toArray((err,result)=>{
        if(err) throw err;
        res.send(result);
    })
})
// // app.get('/restaurantDetails/:id',(req,res) => {
//     console.log(req.params.id)
//     var query = {_id:req.params.id}
//     db.collection('restaurant').find(query).toArray((err,result) =>{
//         if(err) throw err;
//         res.send(result)
//     })
// });

// cuisine
app.get('/cuisine', (req,res)=>{
    dbo.collection('cuisine').find({}).toArray((err,result)=>{
        if (err) throw err;
        res.send(result);
    })
})

// mealtype
app.get('/mealtype', (req,res)=>{
    dbo.collection('mealtype').find({}).toArray((err,result)=>{
        if (err) throw err;
        res.send(result);
    })
})

// orders
app.get('/orders', (req,res)=>{
    dbo.collection('orders').find({}).toArray((err,result)=>{
        if (err) throw err;
        res.send(result);
    })
})
// placeorder POST API
app.post('/placeorder', (req,res)=>{
    dbo.collection('orders').insertOne(req.body, (err, result)=>{
        if(err) throw err
        res.send('Data Added');
    })    
})



// Database Connection
mongoClient.connect(mongoUrl,(err,db)=>{
    if(err) throw err;
    dbo = db.db('Edureka');
    app.listen(port, (err)=>{
        if(err) throw err;
        console.log(chalk.green(`Server is running at port ${port} `))
    })
})


