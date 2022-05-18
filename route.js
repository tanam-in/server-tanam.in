// const {register} = require("./handler");

const routes = function(server, connection) {
  server.route([
    {
      method: 'POST',
      path: '/register',
      handler: async function (request,h) {
        let aaa;
        const {email,name,password} = request.payload;
        //cek email ada atau tidak
        let query = 'SELECT * FROM `users` WHERE email = "'+email+'" ';
        await connection.query(query, function(err, result){
          // aaa = result;
            if(err){
                throw err;
            }
           console.log(result)
           console.log(result.length)
            // if (result !== null) {
            //   return {
            //     status: 'success',
            //     data: {
            //       result,
            //     },
            //   };
            // }
            // return (JSON.stringify({ status: 200, error: null, response: result }));
            // else{
            //   console.log(result.length);
            //     if(result.length > 0){
            //         // query = 'INSERT INTO `users`(`name`, `password`, `email`) VALUES ('+name+','+password+','+email+')';
            //         // connection.query(query, function(err){
            //         //     if(err){
            //         //         throw err;
            //         //     }
            //         //     else{
            //         //         const response = h.response({
            //         //             status: 'success',
            //         //             message: 'yey users berhasil ditambahkan',
            //         //           });
            //         //           response.code(201);
            //         //           response.type('application/json');
            //         //           return response;
            //         //     }
            //         // })
            //         const response = res.response(result);
            //         response.code(200);
            //         response.type('application/json')
            //         return response;
            //     }
            //     else{
            //         // const response = res.response({
            //         //     status: 'error',
            //         //     message: 'maaf email sudah digunakan user lain',
            //         //   });
            //         //   response.code(400);
            //         //   response.type('application/json');
            //         //   return response;
            //         const response = res.response({ msg : "tidak ada data note pada database"});
            //         response.code(200);
            //         response.type('application/json')
            //         return response;
            //     }
            // }
        });
        // console.log(aaa);
        // const response = res.response({
        //   status: 'success',
        //   message: aaa,
        // });
        // response.code(200);
        // response.type('application/json');
        // return response;
      }
    },
    // {
    //   method: 'POST',
    //   path: '/register',
    //   handler: async function (request,h){
    //     const {email,password} = request.payload;
    //     let query = 'SELECT * FROM `users` WHERE email = "'+email+'" and password = "'+password+'"';
    //     await connection.query(query, function(err, result){
    //       if(err){
    //         throw err;
    //       }
    //       else{
    //         if(result.length > 0){
    //           const response = h.response({
    //             status: 'success',
    //             message: 'yey users berhasil login',
    //           });
    //           response.code(201);
    //           response.type('application/json');
    //           return response;
    //         }
    //         else{
    //           const response = h.response({
    //             status: 'error',
    //             message: 'yah users gagal login',
    //           });
    //           response.code(500);
    //           response.type('application/json');
    //           return response;
    //         }
    //       }
    //     });
    //   }
    // }
  ]);
};

module.exports = routes;