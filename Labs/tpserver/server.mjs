"use strict";

import { createServer } from "http";
import *  as url from "url";
import * as fs from "fs";
import * as querystring from "querystring";


const port = process.argv[2] || 8000;
console.log('PORT = ', port);

var names = []

const mimeType = {
    '.ico': 'image/x-icon',
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.eot': 'appliaction/vnd.ms-fontobject',
    '.ttf': 'application/font-sfnt',
    '.woff': 'application/font-woff',
    '.woff2': 'application/font-woff2',
    '.mjs': 'application/javascript'

};

function webserver(request, response) {
    //console.log(request.method + ' ' + request.url);

    let url_parse = url.parse(request.url)
    let pathname = url_parse.pathname;
    console.log(request.url)

    try {
        if (pathname === "/") {
            // sending the header that says content will be in HTML
            //response.writeHeader(200, { 'Content-Type': 'text/html' });
            //response.write('Working !', 'utf8');
            //response.end();
            response.setHeader("Content-Type", "text/html; charset=utf-8");
            response.end("<!doctype html><html><body>Working!</body></html>");
            return;
        }
        else if (pathname === "/exit") {
            // sending the header that says content will be in HTML
            response.setHeader("Content-Type", "text/html; charset=utf-8");
            response.end("<!doctype html><html><body>The server will stop now.</body></html>", () => {
                // calling process.exit(0) after the response is sent
                process.exit(0);
            });
        }
        else if (pathname === "/kill") {
            response.writeHeader(200, { 'Content-Type': 'text/html' });
            response.write('The Server will stop now.', 'utf8', process.exit, 0);
            response.end();
            return;
        }
        else if (pathname.startsWith("/www/")) {

            console.log('pathname = ' + pathname);

            // fs did'nt read /www/exercise1c.html
            pathname = pathname.slice(5);

            if (pathname.startsWith("..")) {
                throw new Error('403');
            }

            console.log("Accessing to " + pathname);

            // checks if the folders and the file exist (using the fs module)
            if (!fs.existsSync(pathname)) {
                response.writeHeader(404, { 'Content-Type': 'text/html' })
                response.write("The file does not exist");
                response.end();
                return;
            } else {
                var data = fs.readFileSync(pathname);
                var ext = pathname.slice(pathname.lastIndexOf('.'));
                response.writeHeader(200, { 'Content-Type': mimeType[ext] });
                response.write(data);
                response.end();
                return;
            }
        }
        else if (pathname.startsWith("/hallo")) {
            var queried = "name="; // Corrected variable name
            var visitor = request.url.slice(request.url.lastIndexOf(queried) + queried.length);
            visitor = querystring.unescape(visitor)
            const htmlResponse = `<!doctype html><html><body>hallo ${visitor}</body></html>`; // Corrected variable name
            response.writeHead(200, { 'Content-Type': 'text/html' });
            response.end(htmlResponse);
            return;
        }
        else if (pathname.startsWith("/salut")) {
            console.log(names)
            var queried = "visiteur="
            var name = request.url.slice(request.url.lastIndexOf(queried) + queried.length);
            name = querystring.unescape(name)
            name = name.replace(/</g, '_').replace(/>/g, '_');
            console.log('name = ' + name);
            response.writeHeader(200, { 'Content-Type': 'text/html' });
            const body = 'salut ' + name + ', the following users have already visited this page:' + names;
            response.end(body, 'utf8');
            names.push(name);
            return;
        }
        else if (pathname.startsWith("/clear")) {
            names = [];
            console.log(names)
            response.writeHeader(200, { 'Content-Type': 'text/html' });
            response.end('The list of users has been cleared.', 'utf8');
            return;
        }
        else {
            throw new Error('404');
        }
    }
    catch (err) {
        console.log(err);
        if (err.message === '404') {
            response.writeHeader(404, { 'Content-Type': 'text/html' });
            response.write('404 Not Found', 'utf8');
            response.end();
            return;
        }
        else if (err.message) {
            response.writeHeader(403, { 'Content-Type': 'text/html' });
            response.write('Forbidden', 'utf8');
            response.end();
            return;
        }
    }
}

// server instanciation
const server = createServer(webserver);

// server starting
server.listen(port, (err) => { });