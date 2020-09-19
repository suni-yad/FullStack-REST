/* database service class  */


const mysql = require('mysql');
const dotenv = require('dotenv');
const { query } = require('express');
let instance = null;
const confResult = dotenv.config();

if (confResult.error) {
    throw confResult.error;
}
// establishing connection  
const connection = mysql.createConnection({

    host: confResult.parsed.HOST,
    user: confResult.parsed.USER,
    password: confResult.parsed.PASSWORD,
    database: confResult.parsed.DATABASE,
    port: confResult.parsed.DB_PORT
    
});

connection.connect((err) => {
    if(err) {
        console.log(err.message);
    }
    console.log('db ' + connection.state);
});


class DbService{
    static getDbServiceInstance(){
        return instance? instance : new DbService();
    }
// read all exixting data from table
    async getAllData(){
      try {
         const response = await new Promise((resolve, reject) => {
            
            const query = " SELECT * FROM names;";

            connection.query(query, (err, results) => {
                if(err) reject(new Error(err.message));
                resolve(results);
            })
         });

          //console.log(response);
         return response ;
        }catch(error){
          console.log(error);
         }
    }
// create new data in database
    async insertNewName(name){
      try {
         const dateAdded = new Date();
         const insertId = await new Promise((resolve, reject) => {
            
            const query = " INSERT INTO names (name , date_added) VALUES (?, ?);";
            
            connection.query(query, [name, dateAdded],(error, result) => {
                if(error) reject(new Error(err.message));
                resolve(result.insertId);
            })
         });

          console.log(insertId);
          return {
            id : insertId,
            name : name,
            dateAdded : dateAdded
          } ;
        } catch(error){
            console.log(error);
          }
    }
// delete a row from table
    async deleteRowById(rowId){
      try {
         //id = parseInt(rowId);
         console.log(rowId);
         const response = await new Promise((resolve, reject) => {
            
            const query = " DELETE FROM names WHERE id = ?";

            connection.query(query, [rowId],(err, result) => {
                if(err) reject(new Error(err.message));
                resolve(result);
            })
         });

          console.log(response);
          return response === 1 ? true : false;
        
        }catch(error){
           console.log(error);
           return false ;
          }
    }

// update data in the table
    async updateNameById(rowId, nameVaue){
      try {
        console.log(rowId);
        console.log(nameVaue);
        const response= await new Promise((resolve, reject) => {
            
            const query = "UPDATE names SET name = ? WHERE id = ? ";

            connection.query(query, [nameVaue, rowId],(err, result) => {
                if(err) reject(new Error(err.message));
                resolve(result);
            })
        });

          //console.log(response);
           return response === 1 ? true : false;
        }catch(error){
           console.log(error);
           return false ;
          }
    }

 // search data from table using name as key   
    async searchByName(nameToFind){
      try {
        const response = await new Promise((resolve, reject) => {
            
            const query = " SELECT * FROM names WHERE name = ? ";

            connection.query(query, [nameToFind], (err, results) => {
                if(err) reject(new Error(err.message));
                resolve(results);
            })
        });

          return response ;
        }catch(error){
        console.log(error);
    }
  }
}
module.exports = DbService;
