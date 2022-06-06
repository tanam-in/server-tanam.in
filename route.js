const {register,login,home,classes,profil,moduleContent,detail_kelas,forum,informasi_gizi,profilEdit,quizCheck,createForum,getForumMassage,sendMassage,classProgress,auth} = require("./handler");

const routes = [
    {
        method: 'POST',
        path: '/register',
        handler: register,
    },
    {
        method: 'POST',
        path: '/login',
        handler: login
    },
    { 
        
        method: 'POST',
        path: '/home',
        handler: home,
        config: {
            ext: {
                onPreAuth: { method: auth }
            }
        },
    },
    {
        config: {
            ext: {
                onPreAuth: { method: auth }
            }
        },
        method: 'POST',
        path: '/class',
        handler: classes
    },
    {
        config: {
            ext: {
                onPreAuth: { method: auth }
            }
        },
        method: 'POST',
        path: '/profile',
        handler: profil
    },
    {
        config: {
            ext: {
                onPreAuth: { method: auth }
            }
        },
        method: 'POST',
        path: '/module',
        handler: moduleContent
    },
    {
        config: {
            ext: {
                onPreAuth: { method: auth }
            }
        },
        method: 'GET',
        path: '/module/{classid}',
        handler: detail_kelas
    },
    {
        config: {
            ext: {
                onPreAuth: { method: auth }
            }
        },
        method: 'GET',
        path: '/module/{classid}/forum',
        handler: forum
    },  
    {
        config: {
            ext: {
                onPreAuth: { method: auth }
            }
        },
        method: 'GET',
        path: '/deteksi/{id}/informations',
        handler: informasi_gizi
    },
    {
        method: 'POST',
        path: '/editProfile',
        handler: profilEdit,
        options: {
            ext: {
                onPreAuth: { method: auth }
            },
            payload: {
                parse: true,
                multipart: {
                    output: 'stream'
                },
                maxBytes: 1000 * 1000 * 5
            }
        },
        
    },
    {
        config: {
            ext: {
                onPreAuth: { method: auth }
            }
        },
        method: 'POST',
        path: '/quizCheck',
        handler: quizCheck
    },
    {
        config: {
            ext: {
                onPreAuth: { method: auth }
            }
        },
        method: 'POST',
        path: '/createForum',
        handler: createForum
    },
    {
        config: {
            ext: {
                onPreAuth: { method: auth }
            }
        },
        method: 'GET',
        path: '/ForumMassage/{forumid}',
        handler: getForumMassage
    },
    {
        config: {
            ext: {
                onPreAuth: { method: auth }
            }
        },
        method: 'POST',
        path: '/sendMassage',
        handler: sendMassage
    },
    {
        method: 'POST',
        path: '/classProgress',
        handler: classProgress,
        options: {
            ext: {
                onPreAuth: { method: auth }
            },
            payload: {
                parse: true,
                multipart: {
                    output: 'stream'
                },
                maxBytes: 1000 * 1000 * 5
            }
        }
    },
  ];

module.exports = routes;
