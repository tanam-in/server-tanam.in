const Hapi = require('@hapi/hapi');
const {connection} = require('./connection');
// const routes = require('./route');
 
const init = async () => {

    const server = Hapi.server({
        port: 5000,
        host: 'localhost',
        routes: {
            cors: {
              origin: ['*'],
            },
          },
    });

    //semua route, maaf panjang
    // server.route(routes);
    await connection.connect(function(err){
        if(err){
            console.log('something wrong with mysql database connection');
            connection.end();
        }
    });
    
    const rotes = require('./route')(server,connection)
    await server.start();

   

    console.log(`Server berjalan pada ${server.info.uri}`);
};
 
init();