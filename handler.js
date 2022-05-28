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
                status: 'error',
                message: 'tidak dapat membuat akun',
              });
            response.code(500);
            return response
        }
        
    } catch (error) {
        console.log(error);
        const response = h.response({
            status: 'success',
            message: 'maaf terdapat masalah dengan koneksi',
          });
        response.code(500);
        return response
    }
}

module.exports.login = async function(request,h){
    try {
        const { email, password } = request.payload;
        const [result,error] = await con.query('SELECT id_user,name From users WHERE email = "'+email+'" and password = "'+password+'" ');
        if(result.length >0){
                let id_user = (result[0].id_user);
                let name = (result[0].name);
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
                    status: 'error',
                    message: 'gagal untuk login, silahkan periksa kembali email atau password anda',
                  });
                response.code(500);
                return response
            }
    } catch (error) {
        console.log(error);
        const response = h.response({
            status: 'success',
            message: 'maaf terdapat masalah dengan koneksi',
          });
        response.code(500);
        return response
    }
}

module.exports.home = async function(request,h){
    try {
        const{userid} = request.payload;
        let progress = 0;
        //mencari kelas yang sudah diikuti user
        const [user_class] = await con.query('Select progress.classes_id, progress.lastest_module, progress.status,progress.recent_modul, moduls.title from progress inner join moduls on progress.recent_modul = moduls.id_moduls AND progress.classes_id = moduls.classes_id where users_id='+userid+' ORDER BY update_at DESC LIMIT 1');
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
                    modul_title: user_class[0].title
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
        console.log(error);
        const response = h.response({
            status: 'success',
            message: 'maaf terdapat masalah dengan koneksi',
          });
        response.code(500);
        return response
    }
}

module.exports.classes = async function(request,h){
    try {
        const{userid} = request.payload;
        const [userClass] = await con.query(`SELECT 
                                                classes.*,
                                                (progress.lastest_module / classes.total_module * 100) AS progress,
                                                moduls.title
                                            FROM
                                                (classes)
                                                    LEFT JOIN
                                                (progress
                                                RIGHT JOIN moduls ON progress.lastest_module = moduls.id_moduls and progress.classes_id = moduls.classes_id) ON classes.id_class = progress.classes_id
                                            WHERE
                                                (progress.users_id = `+userid+`)`);
        let temp = [];
        userClass.forEach(element => {
            temp.push(element.id_class);
        });

        // console.log(userClass);
        const [otherClass] = await con.query(`Select classes.*, class_first_modul.modul_title
        From classes left join class_first_modul on classes.id_class = class_first_modul.id_class
        where classes.id_class not in (`+temp+`)`);

            const response = h.response({
                status: 'success',
                data: {
                    class: {userClass, otherClass}
                }
              });
              response.code(201);
              return response
        
    } catch (error) {
        console.log(error);
        const response = h.response({
            status: 'Error',
            message: 'maaf terdapat masalah dengan koneksi',
          });
        response.code(500);
        return response
    }
}

module.exports.profil = async function(request,h){
    try {
        const{userid} = request.payload;
        const [user_profil] = await con.query('SELECT users.*, SUM(CASE progress.status WHEN "0" THEN 1 ELSE 0 END) as progress,SUM(CASE progress.status WHEN "1" THEN 1 ELSE 0 END) as finish FROM users INNER JOIN progress on users.id_user = progress.users_id WHERE users.id_user = '+userid+'');
        const user ={
            id_user: user_profil[0].id_user,
            name: user_profil[0].name,
            password: user_profil[0].password,
            email: user_profil[0].email,
            age: user_profil[0].age,
            address: user_profil[0].address,
            profile_picture: user_profil[0].profile_picture,
        }
        console.log(user)
        const response = h.response({
            status: 'success',
            data: {
                user: user,
                progress: user_profil[0].progress,
                finish: user_profil[0].finish
            }
          });
          response.code(201);
          return response

    } catch (error) {
        console.log(error);
        const response = h.response({
            status: 'success',
            message: 'maaf terdapat masalah dengan koneksi',
          });
        response.code(500);
        return response
    }
}

module.exports.moduleContent = async function(request,h){
    try {
        const{classid,modulid} = request.params;
        const next_module = parseInt(modulid)+1;
        const [result] = await con.query('SELECT * FROM `moduls` WHERE classes_id='+classid+' and id_moduls='+modulid+'');
        const response = h.response({
            status: 'success',
            data: {
                module: result,
                nextModule: next_module,
                class_id: classid
            }
          });
          response.code(201);
          return response
    } catch (error) {
        console.log(error);
        const response = h.response({
            status: 'error',
            message: 'maaf terdapat masalah dengan koneksi',
          });
        response.code(500);
        return response
    }
}

//tambahan
module.exports.detail_kelas = async function (request, h) {
    try {
        const {classid} = request.params;
        const [hasil] = await con.query('Select id_class, title, detail, picture, total_module from classes where id_class = '+classid+'');
        if( hasil.length > 0) {
            const [modul] = await con.query('SELECT title, id_moduls FROM moduls WHERE EXISTS(SELECT id_class FROM classes WHERE classes.id_class = moduls.classes_id AND moduls.classes_id = '+classid+');');
            const response= h.response({
                status: 'success',
                data: {
                    detail_kelas: hasil,
                    listmodul: modul
                }
            });
            response.code (201);
            return response
            } 
            else{
                const response = h.response({
                    status: '',
                    message: 'maaf kelas tidak ditemukan',
                  });
                response.code(201);
                return response
        } 
    }   catch (error) {
            console.log (error);
            const response = h.response({
                status: 'success',
                message: 'maaf terdapat masalah dengan koneksi',
              });
            response.code(500);
            return response
        }   
} 

module.exports.forum = async function (request, h) {
    try {
        const {classid} = request.params;
        const [forum] = await con.query('SELECT title, question, time FROM forum WHERE EXISTS(SELECT id_class FROM classes WHERE classes.id_class = forum.classes_id AND forum.classes_id = '+classid+') AND EXISTS(SELECT id_user FROM users WHERE users.id_user = forum.users_id)');
        if (forum.length > 0) {
            const response = h.response ({
                status: 'success',
                data: {
                    listforum: forum,
                }
            });
            response.code(201);
                return response
        }
        else {
            const response = h.response({
                status: 'success',
                message: 'belum ada diskusi'
            });
            response.code(201);
            return response
        }
    }
    catch(error) {
        console.log (error);
        const response = h.response({
            status: 'error',
            message: 'maaf terdapat masalah dengan koneksi',
          });
        response.code(500);
        return response
    }
}

module.exports.informasi_gizi = async function (request, h) {
    try {
        const {id} = request.params;
        const [hasil] = await con.query('SELECT name, content, benefit FROM informations WHERE EXISTS(SELECT id_class FROM classes WHERE classes.id_class = informations.classes_id AND informations.classes_id = '+id+')');
        if( hasil.length > 0) {
            let name = hasil[0].name;
            let content = hasil[0].content;
            let benefit = hasil[0].benefit;
            const response= h.response({
                status: 'success',
                data: {
                    judul: name,
                    kandungan: content,
                    manfaat: benefit
                }
            });
            response.code (201);
            return response
            } 
            else{
                const response = h.response({
                    status: 'fail',
                    message: 'maaf informasi tidak ditemukan',
                  });
                response.code(404);
                return response
        } 
    } 
    catch (error) {
        console.log(error);
        const response = h.response({
            status: 'success',
            message: 'maaf terdapat masalah dengan koneksi',
          });
        response.code(500);
        return response
    }
}

module.exports.profilEdit = async function (request,h){
    try {
       const {userid,age,address,profile_picture} = request.payload;
       const [update,metadata] = await con.query('UPDATE users SET age="'+age+'",address="'+address+'",profile_picture="'+profile_picture+'" WHERE id_user = '+userid+'');
       if(metadata !== 1){
        const response = h.response({
            status: 'success',
            message: 'berhasil mengupdate profile'
          });
          response.code(201);
          return response
       }
       else{
        const response = h.response({
            status: 'error',
            message: 'gagal mengupdate profile, terdapat masalah dengan server'
          });
          response.code(500);
          return response
       }
    } catch (error) {
        console.log (error);
        const response = h.response({
            status: 'error',
            message: 'maaf terdapat masalah dengan koneksi',
          });
        response.code(500);
        return response
    }
}
