'use strict'; // to avoid creating global variables

const Hapi = require('@hapi/hapi'); // importing
const { channel } = require('diagnostics_channel');
const { request } = require('http');
const path = require('path');
const Connection = require('./dbconfig');
const Users = require('./models/users');

const init = async () => {

    const server = Hapi.server({
        port: 1234,
        host: 'localhost',
        routes: {         // this is for all to be served from static folder
            files: {
                relativeTo: path.join(__dirname,'static')
            }
        }
    });

    await server.register([
        {
            plugin: require("hapi-geo-locate"),
            options: {
                enabledByDefault: true
            }
        },
        {
            plugin: require("@hapi/inert")
        },
        {
            plugin: require("@hapi/vision")
        }
    ])

    server.views({                        // adding non hapi plugin
        engines: {
            hbs: require('handlebars')
        },
        path: path.join(__dirname, 'views'),
        layout: 'default'
    })

    server.route([
        {
            method: 'GET',
            path: '/',
            handler: (request, h) => {
                // return '<h1>Hello World!</h1>';
                return h.file('welcome.html');
            },
            // options: {                    // for only this rout to be from static
            //     files: {
            //         relativeTo: path.join(__dirname,'static')
            //     }
            // }
        },
        // {
        //     method: 'GET',
        //     path: '/dynamic',
        //     handler: (request, h) => {
        //         const data = {
        //             name: 'Komron'
        //         }
        //         return h.view('index', data)
        //     }
        // },
        {
            method: 'POST',
            path: '/login',
            handler: (request, h) => {

                // console.log(request.payload.username);  // These 2 lines are to show 
                // console.log(request.payload.password);  // input stuff in console

                // if (request.payload.username === "Komron" && request.payload.password === "1234"){
                //     return h.file('logged-in.html');   // static
                // } else {
                //     return h.redirect('/');
                // }
                Users.createUser(request.payload.username, request.payload.password);                
                return h.view('index', {username: request.payload.username});
            }
        },
        {
            method: 'GET',
            path: '/download',
            handler: (request, h) => {
                return h.file('welcome.html', {
                    mode: 'attachment', // 'inline' to just show the file
                    filename: 'welcome-download.html'
                });
            }
        },
        // {
        //     method: 'GET',
        //     path: '/location',
        //     handler: (request, h) => {
        //         if (request.location) {
        //             return h.view('location', {location: request.location.ip});
        //         } else {
        //             return h.view('location', {location: "Your location isn't enabled by default"})
        //         }

        //     }
        // },
        // {
        //     method: 'GET',
        //     path: '/users', // for commented codes below path: '/users/{user?}',
        //     handler: (request, h) => {
        //         // if (request.params.user){
        //         //     return `<h1>Hello ${request.params.user}</h1>`;
        //         // } else {
        //         //     return 'Hi smbd';
        //         // }


        //         // return `<h1>${request.query.name} ${request.query.lastname}</h1>`
                
                
                
        //         // console.log(h);                  // to redirect to main path
        //         // return h.redirect('/');


        //         return "<h1>USERS PAGE</h1>"

        //     }
        // },
        {
            method: 'GET',
            path: '/{any*}',
            handler: (request, h) => {
                return '<h1>you must be lost</h1>'
            }
        },
        {
            method: 'GET',
            path: '/getUsers',
            handler: async (request, h) => {
                const dbConnection = await Connection.connect;                
                return h.view('index', {users});
            }
        }
    ]);

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();