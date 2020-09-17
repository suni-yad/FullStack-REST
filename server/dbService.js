const mysql = require('mysql');
const dotenv = require('dotenv');
let instance = null;
const confResult = dotenv.config();

if (confResult.error) {
    throw confResult.error;
}
   
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

    async deleteRowById(id){
      try {
         id = parseInt(id);
         const response =await new Promise((resolve, reject) => {
            
            const query = " DELETE FROM names WHERE id = ?";

            connection.query(query, [id],(err, result) => {
                if(err) reject(new Error(err.message));
                resolve(result.affectedrows);
            })
         });

          console.log(response);
          return response === 1 ? true : false;
        }catch(error){
           console.log(error);
           return false ;
          }
    }


    async updateNameById(id, name){
      try {
        id = parseInt(id, 10);
        const response= await new Promise((resolve, reject) => {
            
            const query = "UPDATE names SET name = ? WHERE id = ?";

            connection.query(query, [name, id],(err, result) => {
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
    async searchByName(name){
      try {
        const response = await new Promise((resolve, reject) => {
            
            const query = " SELECT * FROM names WHERE name = ?;";

            connection.query(query, [name], (err, results) => {
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