const Hapi = require('@hapi/hapi');
const con =require('./connection');
const routes = require('./route');
const PORT = process.env.PORT || 3000;

const init = async () => {

    const server = Hapi.server({
        port: PORT,
        host: 'localhost',
        routes: {
            cors: {
              origin: ['*'],
            },
          },
    });

    con.authenticate().then(()=>{
        console.log('connected db');
    }).catch(()=>{
        console.log('error connected db');
    });

    
    
    // const rotes = require('./route')(server,connection)
    server.route(routes);

    server.ext('onRequest',async (request, h)=>{
        const {key} = request.headers;
        if(key == process.env.KEY)
        return h.continue;
        else{
            const response = h.response({
                status: 'error',
                message: 'maaf kamu tidak memiliki akses',
              });
            response.code(401);
            return response
        }
      })
    await server.start();


    console.log(`Server berjalan pada ${server.info.uri}`);
};
 
init();