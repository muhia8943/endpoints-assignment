import mssql from 'mssql'
import dotenv from 'dotenv'

dotenv.config()

console.log(process.env.MA_SERVER)

export const sqlConfig={
  user: process.env.DB_USER as string,
  password: process.env.DB_PWD as string,
  database: process.env.DB_NAME as string,
  server: process.env.MA_SERVER as string,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: false, 
    trustServerCertificate: true 
  }
}


const pool = mssql.connect(sqlConfig)
 async function testConnection(){
     const pool = await mssql.connect(sqlConfig)

     if(pool.connected){
         console.log("Connection established ...");

         console.log();
        
     }else{
         console.log("Error establishing connection");
     }
 }

 testConnection()

 export { mssql,pool}