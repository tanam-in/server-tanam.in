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
        const [result,error] = await con.query('SELECT id_user,name From users WHERE email = "'+email+'" and password = "'+password+'" ');
        let id_user = (result[0].id_user);
        let name = (result[0].name);
            if(result.length >0){
                const response = h.response({
                    status: 'success',
                    message: 'berhasil melakukan login',
                    data: {
                        userid: id_user,
                        name: name
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

module.exports.home = async function(request,h){
    try {
        const{userid} = request.payload;
        let progress = 0;
        //mencari kelas yang sudah diikuti user
        const [user_class] = await con.query('Select classes_id, lastest_module, status,recent_modul from progress where users_id='+userid+'');
        if(user_class.length >0){
            const class_id = user_class[0].classes_id;
            //mengambil data kelas dari db
            const [kelas] = await con.query('Select * from classes where id_class='+class_id+'');
            //menghitung progress user
            progress = user_class[0].lastest_module / kelas[0].total_module * 100;
            // console.log(progress);
            const response = h.response({
                status: 'success',
                data: {
                    kelas: kelas,
                    progress: progress,
                    recent_modul: user_class[0].recent_modul,
                }
              });
            response.code(200);
            return response
        }
        else{
            const response = h.response({
                status: 'success',
                message: 'maaf anda belum memiliki kelas',
              });
            response.code(200);
            return response
        }
    } catch (error) {
        console.log(error)
    }
   

}