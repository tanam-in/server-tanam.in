# tanamin-api

registrasi
method: POST
link: [local](http://localhost:5000/register)
body:  { "email": "[email user]", "name": "[nama user]",  "password": "[password user]"}
respon: 
(berhasil) respon code: 201
(gagal) respon code 500
respond: {
    "status": "success"/"error",
    "message": "[pesan]"
}

Login
method: POST
link: [local](http://localhost:5000/login)
body:  { "email": "[email user]",  "password": "[password user]"}
respon: 
(berhasil) respon code: 201
(gagal) respon code 500
respond: {
    "status": "success"/"error",
    "message": "[pesan]",
    "data" : {
      "userid": [userid]
      "name"  : [name]
    }
}

home
method: POST
link: [local](http://localhost:5000/home)
body:  { "userid": "[userid]"}
respon: 
(berhasil) respon code: 201
(gagal) respon code 500
respond: {
    "status": "success"/"error",
    data: {
        "kelas": [
            {
                "id_class": "[id kelas]",
                "title": "[nama kelas]"
                "detail": "[detail kelas]",
                "picture": "[link gambar]",
                "total_module": [total module]
            }
        ],
        "progress": [progress],
        "recent_modul": [modul saat ini]
    }
}
