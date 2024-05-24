"use strict";

import { createServer } from "http";
import *  as url from "url";
import * as fs from "fs";
import * as querystring from "querystring";


const port = process.argv[2] || 8000;
//console.log('PORT = ', port);

//var names = []

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

function getCoordinatesForPercent(percent) {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
}

function webserver(request, response) {
    //console.log(request.method + ' ' + request.url);

    let url_parse = url.parse(request.url)
    let pathname = url_parse.pathname;
    console.log(request.url)

    try {
        if (pathname === "/") {
            response.setHeader("Content-Type", "text/html; charset=utf-8");
            response.end("<!doctype html><html><body>Working!</body></html>");
            return;
        }
        else if (pathname.startsWith("/Data")) {
            if (!fs.existsSync("storage.json")) {
                throw new Error('404');
            } else {
                var data = fs.readFileSync("storage.json")
                response.writeHeader(200, { 'Content-Type': 'application/json' })
                response.write(data);
                response.end();
                return;
            }
        }
        else if (pathname === "/end") {
            response.writeHeader(200, { 'Content-Type': 'text/html' });
            response.write('The Server will stop now.', 'utf8', process.exit, 0);
            response.end();
            return;
        }
        else if (pathname.startsWith("/WWW/")) {

            console.log('pathname = ' + pathname);
            pathname = pathname.slice(5);

            if (pathname.startsWith("..")) {
                throw new Error('403');
            }

            console.log("Accessing to " + pathname);

            // checks if the folders and the file exist (using the fs module)
            if (!fs.existsSync(pathname)) {
                throw new Error('404');
            } else {
                var data = fs.readFileSync(pathname, 'utf8');
                var ext = pathname.slice(pathname.lastIndexOf('.'));
                response.writeHeader(200, { 'Content-Type': mimeType[ext] });
                response.write(data);
                response.end();
                return;
            }
        }
        else if (pathname.startsWith("/Show")) {
            if (!fs.existsSync("storage.json")) {
                throw new Error('404');
            } else {
                var data = fs.readFileSync("storage.json")
                response.writeHeader(200, { 'Content-Type': 'application/json' })
                response.write(data);
                response.end();
                return;
            }
        }
        else if (pathname.startsWith("/add")) {
            let query = querystring.parse(url_parse.query);
            console.log(query);
            var value = query.value;
            var title = query.title;
            var color = query.color;

            if (value == undefined || title == undefined || color == undefined) {
                throw new Error('400');
            }
            var data = fs.readFileSync("storage.json");
            var json = JSON.parse(data);
            var new_data = { "title": title, "value": value, "color": color };
            json.push(new_data);
            fs.writeFileSync("storage.json", JSON.stringify(json));
            response.writeHeader(200, { 'Content-Type': 'text/html' });
            response.write('Data added', 'utf8');
            response.end();
            return;
        }
        else if (pathname.startsWith("/remove")) {
            let query = querystring.parse(url_parse.query);
            var data = JSON.parse(fs.readFileSync("storage.json"));
            data.splice(query.index, 1);
            fs.writeFileSync("storage.json", JSON.stringify(data));
            response.writeHeader(200);
            response.write('Data deleted', 'utf8');
            response.end();
            return;
        }
        else if (pathname.startsWith("/clear")) {
            fs.writeFileSync("storage.json", JSON.stringify([{ "title": "empty", "color": "red", "value": 1 }]));
            response.writeHeader(200);
            response.end();
            return;
        }
        else if (pathname.startsWith("/restore")) {
            fs.writeFileSync("storage.json", JSON.stringify([
                {
                    "title": "foo",
                    "color": "red",
                    "value": 20
                },
                {
                    "title": "bar",
                    "color": "ivory",
                    "value": 50
                },
                {
                    "title": "baz",
                    "color": "blue",
                    "value": 30
                }
            ]));
            response.writeHeader(200);
            response.write('Data restored to the database', 'utf8');
            response.end();
            return;
        }
        else if (pathname.startsWith("/PieCh")) {
            var slices = JSON.parse(fs.readFileSync("storage.json"));
            var rep = '<svg id="pieChart" viewBox="-1 -1 2 2" height=500 width=500>';
            var value_tot = 0;
            for (var slice of slices) {
                value_tot += new Number(slice.value);
            }
            var cum = 0;
            for (var slice of slices) {
                var percent = slice.value / value_tot;
                var [x_start, y_start] = getCoordinatesForPercent(cum);
                cum += percent;
                var [x_end, y_end] = getCoordinatesForPercent(cum);
                var largeArcFlag = percent > .5 ? 1 : 0;
                var pathData = [
                    `M ${x_start} ${y_start}`,
                    `A 1 1 0 ${largeArcFlag} 1 ${x_end} ${y_end}`,
                    `L 0 0`,
                ].join(' ');

                rep += '<path d="' + pathData + '" fill="' + slice.color + '"></path>';
            }
            rep += '</svg>'
            response.writeHeader(200, { "Content-Type": "image/svg+xml" });
            response.write(rep);
            response.end();
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