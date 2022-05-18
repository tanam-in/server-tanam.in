// const {register} = require("./handler");

const routes = [
    {
        method: 'POST',
        path: '/register',
        handler: async function (request,h) {
          const {email,name,password} = request.payload;
          //cek email ada atau tidak
          let query = 'SELECT * FROM `users` WHERE email = "'+email+'" ';
          await connection.query(query, function(err, result){
              if(err){
                  throw err;
              }
              else{
                  if(result.length > 0){
                      query = 'INSERT INTO `users`(`name`, `password`, `email`) VALUES ('+name+','+password+','+email+')';
                      await connection.query(query, function(err){
                          if(err){
                              throw err;
                          }
                          else{
                              const response = h.response({
                                  status: 'success',
                                  message: 'yey users berhasil ditambahkan',
                                });
                                response.code(201);
                                response.type('application/json');
                                return response;
                          }
                      })
                  }
                  else{
                      const response = h.response({
                          status: 'success',
                          message: 'maaf email sudah digunakan user lain',
                        });
                        response.code(400);
                        response.type('application/json');
                        return response;
                  }
              }
          });
           
      }
    }
  ];

module.exports = routes;