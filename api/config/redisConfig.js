const { createClient } = require( 'redis');

const client = createClient({
    password: process.env.REDIS_PASSWD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
});

const connectToRedis = async() =>{
    client.on("connect",()=>{
        console.log("connected to REDIS");
    })
    client.on("ready",()=>{
        console.log("Ready")
    })
    client.on("error",(err)=>{
        console.log(err,"redis")
    })
    await client.connect();

}

module.exports = {connectToRedis,client};