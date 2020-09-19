const express = require('express');
const server = express();
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const dbService = require('./dbService');

server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended : false }));

// create
server.post('/insert', (request, response) => {
//console.log(request.body);
const { name } = request.body;
const db = dbService.getDbServiceInstance();
const result = db.insertNewName(name);

result
.then(data => response.json({ data : data}))
.catch(err => console.log(err));
});

//read
server.get('/getAll', (request, response) =>{
    const db = dbService.getDbServiceInstance();
    const result = db.getAllData();
    result
    .then(data => response.json({data : data}))
    .catch(err => console.log(err));
})

//update
server.patch('/update/:id', (request, response) => {
    console.log(request.body);
    const {id, name} = request.body;
    const db = dbService.getDbServiceInstance();

    const result = db.updateNameById(id,name);

    result
    .then(data => response.json({success : data}))
    .catch(err => console.log(err));
});


//delete

server.delete('/delete/:id', (request, response) => {
    const id  = request.params.id;
    console.log(id);
    const db = dbService.getDbServiceInstance();
    const result = db.deleteRowById(id);
    result
    .then(data => response.json({success : data}))
    .catch(err => console.log(err));
});

//search
server.get('/search/:name', (request, response) => {
    const name = request.params.name;
    const db = dbService.getDbServiceInstance();
    const result = db.searchByName(name);

    result
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));

})

server.listen(process.env.PORT, () => console.log('app is running'));