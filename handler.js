const con = require('./connection');
const moment = require('moment');
let fs = require('fs');
const {Storage} = require("@google-cloud/storage");

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
        const [user_class] = await con.query(`SELECT classes.*,(progress.lastest_module / classes.total_module * 100) AS progress, moduls.title AS modul_title, progress.lastest_module FROM classes LEFT JOIN progress ON classes.id_class = progress.classes_id RIGHT JOIN moduls ON progress.lastest_module = moduls.id_moduls AND progress.classes_id = moduls.classes_id WHERE progress.users_id = `+userid+` order by progress.update_at desc limit 1`);
        if(user_class.length >0){
            // const class_id = user_class[0].classes_id;
            // //mengambil data kelas dari db
            // const [kelas] = await con.query('Select * from classes where id_class='+class_id+'');
            // //menghitung progress user
            // progress = user_class[0].lastest_module / kelas[0].total_module * 100;
            // console.log(progress);
            const response = h.response({
                status: 'success',
                data: {
                    kelas: user_class,
                    // progress: progress,
                    // recent_modul: user_class[0].recent_modul,
                    // modul_title: user_class[0].title
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
            status: 'error',
            message: 'maaf terdapat masalah dengan koneksi',
          });
        response.code(500);
        return response
    }
}

module.exports.classes = async function(request,h){
    try {
        const{userid} = request.payload;
        const [userClass] = await con.query(`SELECT classes.*,(progress.lastest_module / classes.total_module * 100) AS progress, moduls.title AS modul_title, progress.lastest_module
                                            FROM classes
                                            LEFT JOIN progress ON classes.id_class = progress.classes_id
                                            RIGHT JOIN moduls ON progress.lastest_module = moduls.id_moduls AND progress.classes_id = moduls.classes_id
                                            WHERE progress.users_id = `+userid+`
                                            UNION
                                            SELECT classes.*, "0.0" AS progress, moduls.title AS modul_title, "1" AS lastest_module
                                            FROM classes
                                            LEFT JOIN moduls ON classes.id_class = moduls.classes_id 
                                            WHERE classes.id_class NOT IN (SELECT classes.id_class
                                            FROM classes
                                            LEFT JOIN progress ON classes.id_class = progress.classes_id
                                            RIGHT JOIN moduls ON progress.lastest_module = moduls.id_moduls AND progress.classes_id = moduls.classes_id
                                            WHERE progress.users_id = `+userid+`)
                                            GROUP BY classes.id_class`)
        const response = h.response({
            status: 'success',
            data: {
                class: userClass
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
        const{classid,modulid,userid} = request.payload;
        // const next_module = parseInt(modulid)+1;
        let next_module = 0;
        const [result] = await con.query('SELECT moduls.*, classes.total_module FROM moduls INNER JOIN classes on moduls.classes_id = classes.id_class  WHERE classes_id='+classid+' and id_moduls='+modulid+'');
        const [maxId] = await con.query('SELECT id_moduls FROM moduls where classes_id = '+classid+' and quiz_id is not null');
        if(result.length > 0){
            const [progress] = await con.query('select lastest_module from progress where users_id='+userid+' and classes_id='+classid+'');
            const updateAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
            if(progress[0].lastest_module >= modulid || modulid == maxId[0].id_moduls){
                const [update] = await con.query('UPDATE `progress` SET recent_modul='+modulid+', update_at="'+updateAt+'" where users_id='+userid+' and classes_id='+classid+'')
            }
            else if (progress[0].lastest_module < modulid && modulid != maxId[0].id_moduls){
                const [update] = await con.query('UPDATE `progress` SET recent_modul='+modulid+',lastest_module='+modulid+' ,update_at="'+updateAt+'" where users_id='+userid+' and classes_id='+classid+'')
            }

            if(result[0].quiz_id === null){
                const response = h.response({
                    status: 'success',
                    data: {
                        module: result,
                        nextModule: next_module,
                        class_id: classid,
                        maxid: maxId[0].id_moduls
                    }
                  });
                  response.code(201);
                  return response
            }
            else{
                const title = result[0]
                const [quiz] = await con.query('select soal from quiz where id_quiz = '+result[0].quiz_id+'');
                let question = JSON.parse(quiz[0].soal);
                const response = h.response({
                    status: 'success',
                    data: {
                        module: question,
                        title: result[0].title,
                        content: result[0].content,
                        nextModule: next_module,
                        class_id: classid.Date,
                        maxid: maxId[0].id_moduls,
                        quizid: result[0].quiz_id
                    }
                  });
                  response.code(201);
                  return response
            }

            
        }
        else{
            const response = h.response({
                status: 'error',
                message: 'maaf module yang kamu cari tidak ditemukan',
              });
            response.code(500);
            return response
        }
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
        const [forum] = await con.query('SELECT id_forum, title, question, time FROM forum WHERE EXISTS(SELECT id_class FROM classes WHERE classes.id_class = forum.classes_id AND forum.classes_id = '+classid+') AND EXISTS(SELECT id_user FROM users WHERE users.id_user = forum.users_id)');
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
       const {userid,name,age,address,profile_picture} = request.payload;
       let [update,metadata] = []
       console.log(profile_picture);
       if(request.payload.hasOwnProperty('profile_picture')){
           
           const gc = new Storage({
               keyFilename: __dirname+'/tanamin-351905-755dd0ae131c.json',
               projectId: "tanamin-351905"
           });

           const tanaminBucket = gc.bucket('tanamin');

            let ext = profile_picture.hapi.filename.split('.').pop();
            let picName =  userid+'_'+name+'.'+ext;

            const blob = await profile_picture.pipe(tanaminBucket.file('profile/'+picName).createWriteStream({
                resumable: false
            }));
           [update,metadata] = await con.query('UPDATE users SET age="'+age+'",address="'+address+'" ,name="'+name+'",profile_picture="'+picName+'" WHERE id_user = '+userid+'');
       }    
       else{
        [update,metadata] = await con.query('UPDATE users SET age="'+age+'",address="'+address+'" ,name="'+name+'" WHERE id_user = '+userid+'');
       }
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

module.exports.quizCheck = async function(request,h){
    try {
       const {answer,quizid,userid,classid,moduleid} = request.payload;
       const [ans] = await con.query('select kunci from quiz where id_quiz = '+quizid+'');
       const key_split = ans[0].kunci.split(';');
       let score = 0;
       key_split.forEach(function(value,key){
           if(answer[key] == value) score+=1;
       });
       score *= 20;
       const [inset,metadata] = await con.query('INSERT INTO `quiz_result`(`users_id`, `score`, `quiz_id`) VALUES ('+userid+','+score+','+quizid+')');
       if( score >= 60){
            const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
            const [update] = await con.query('UPDATE `progress` SET status= 1,lastest_module = '+moduleid+',update_at="'+date+'" WHERE users_id = '+userid+' and classes_id='+classid+'');
       }
       if(metadata === 1){
           const response = h.response({
               status: 'success',
               message: 'berhasil memeriksa jawaban',
               data: {score: score}
           });
           response.code(201);
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

module.exports.createForum = async function(request,h){
    try {
        const {classid, userid, title, question} = request.payload;
        const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const [inset,metadata] = await con.query('INSERT INTO `forum`(`classes_id`, `users_id`, `title`, `question`, `time`) VALUES ('+classid+','+userid+',"'+title+'","'+question+'","'+date+'")');
        if(metadata === 1){
            const response = h.response({
                status: 'success',
                message: 'berhasil membuat forum baru'
            });
            response.code(201);
            return response
        }
        else{
            const response = h.response({
                status: 'error',
                message: 'maaf terdapat masalah saat membuat forum',
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

module.exports.getForumMassage = async function(request,h){
    try {
        const {forumid} = request.params;
        const [massage] = await con.query('SELECT reply_forum.*, users.name FROM reply_forum INNER JOIN users on reply_forum.users_id = users.id_user WHERE reply_forum.id_forum = '+forumid+' ORDER BY reply_forum.timestamp ASC');
        if(massage.length > 0){
            massage.forEach(element => {
                let date = moment(element.timestamp).format('MMMM Do YYYY, h:mm:ss a');
                element.timestamp = date;
            });
            
            const response = h.response({
                status: 'success',
                data: massage
            });
            response.code(201);
            return response

        }
        else{
            const response = h.response({
                status: 'error',
                message: 'maaf forum yang anda cari tidak ditemukan',
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

module.exports.sendMassage = async function(request,h){
    try {
        const {idforum, userid, massage} = request.payload;
        const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const [insert, metadata] = await con.query('INSERT INTO reply_forum(id_forum,users_id,messege,timestamp) VALUES ('+idforum+','+userid+',"'+massage+'","'+date+'")');
        if(metadata === 1){
            const response = h.response({
                status: 'success',
                message: 'berhasil mengirim pesan'
            });
            response.code(201);
            return response
        }
        else{
            const response = h.response({
                status: 'error',
                message: 'maaf terdapat masalah saat mengirim pesan',
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

module.exports.classProgress = async function(request,h){
    try {
        const {userid,classid,picture} = request.payload;

        const gc = new Storage({
            keyFilename: __dirname+'/tanamin-351905-755dd0ae131c.json',
            projectId: "tanamin-351905"
        });

        console.log(gc);

        const tanaminBucket = gc.bucket('tanamin');

        let ext = picture.hapi.filename.split('.').pop();
        let picName =  userid+'_'+classid+'.'+ext;

        const blob = await picture.pipe(tanaminBucket.file('progress/'+picName).createWriteStream({
            resumable: false
        }));
        const [update] = await con.query('UPDATE `progress` SET progres_pic = "'+picName+'" WHERE users_id = '+userid+' and classes_id='+classid+'');
    
        const response = h.response({
            status: 'success',
            message: 'berhasil mengirim foto progress'
        });
        response.code(201);
        return response
        
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

module.exports.joinClass = async function(request,h){
    try {
        const {userid,classid} = request.payload;
        const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const [insert,metadata] = await con.query('INSERT INTO `progress`(`users_id`, `classes_id`, `lastest_module`, `recent_modul`, `status`, `update_at`) VALUES ('+userid+','+classid+',1,1,0,"'+date+'")');
        if(metadata === 1){
            const response = h.response({
                status: 'success',
                message: 'selamat kamu berhasil menikuti kelas'
            });
            response.code(201);
            return response
        }
        else{
            const response = h.response({
                status: 'error',
                message: 'maaf terdapat masalah saat menambah kelas',
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
