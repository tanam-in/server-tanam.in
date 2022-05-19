const con = require('./connection');

module.exports.register = async function(request,h){
    try {
        const { email, name, password } = request.payload;
        // cek email sudah ada di db atau tidak
        const [result] = await con.query('SELECT * From users WHERE email = "'+email+'" ');
        if(result.length === 0){
            const [resInsert,metadata] = await con.query('INSERT INTO `users`(`name`, `password`, `email`) VALUES ("'+name+'","'+password+'","'+email+'")');
            console.log(metadata);
            if(metadata === 1){
                const response = h.response({
                    status: 'success',
                    message: 'berhasil membuat akun',
                  });
                response.code(201);
                return response
            }
            else{
                const response = h.response({
                    status: 'error',
                    message: 'terjadi kesalahan dengan server',
                  });
                response.code(500);
                return response
            }
        }
        else{
            const response = h.response({
                status: 'success',
                message: 'tidak dapat membuat akun',
              });
            response.code(500);
            return response
        }
        
    } catch (error) {
        console.log(error);
    }
}

module.exports.login = async function(request,h){
    try {
        const { email, password } = request.payload;
        const result = await con.query('SELECT id_user From users WHERE email = "'+email+'" and password = "'+password+'" ');
        // console.log(result[0]);
            if(result.length >0){
                const response = h.response({
                    status: 'success',
                    message: 'berhasil melakukan login',
                    data: {
                        userid: result
                    }
                  });
                response.code(201);
                return response
            }
            else{
                const response = h.response({
                    status: 'success',
                    message: 'gagal untuk login, silahkan periksa kembali email atau password anda',
                  });
                response.code(500);
                return response
            }
    } catch (error) {
        console.log(error);
    }
}