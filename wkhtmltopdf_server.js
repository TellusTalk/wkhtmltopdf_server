var
    PASSPHRASE = 'Some Secret!',
    HTTP_PORT = 7201,
    WORK_DIRECTORY_PATH = '/path/work/';

var
    http = require('http'),
    fs = require('fs'),
    execFile = require('child_process').execFile;

function app_log(text_in) {
    'use strict';
    console.log('[' + (new Date()).toISOString() + ']');
    console.log(text_in);
}

function html_request(request, response) {
    'use strict';
    var
        unique_id = new Date().toISOString() + '_' + Math.floor(Math.random() * 1000),
        source_file = WORK_DIRECTORY_PATH + unique_id + '.html',
        target_file = WORK_DIRECTORY_PATH + unique_id + '.pdf',
        wkhtmltopdf_options = request.headers.wkhtmltopdf_options ? request.headers.wkhtmltopdf_options.split(' ') : [],
        write_stream;

    if (request.url === '/favicon.ico') {
        response.writeHead(200, {'Content-Type': 'image/x-icon', 'Cache-Control': 'max-age=360000, must-revalidate'});
        response.end();
        app_log('[createServer request] ' + unique_id + ': favicon requested');
        return;
    }

    if (request.method === 'GET') {
        response.writeHead(200, {'Content-Type': 'text/plain'});
        response.end('Hello');
        app_log('[createServer request] ' + unique_id + ': response sent');
        return;
    }

    if (request.method === 'POST') {
        if (request.headers.passphrase !== PASSPHRASE) {
            response.writeHead(404, {'Content-Type': 'text/plain'});
            response.end();
            app_log('[createServer request] ' + unique_id + ': passphrase invalid');
            return;
        }
        write_stream = fs.createWriteStream(source_file);

        request.pipe(write_stream);

        write_stream.on("close", function () {
            function pdf_response(error, stdout, stderr) {
                var
                    response_header = {},
                    read_stream;

                if (error === null) {
                    response_header['Content-Type'] = 'application/pdf';
                    response.writeHead(200, response_header);

                    read_stream = fs.createReadStream(target_file);

                    read_stream.on("close", function () {
                        fs.unlink(source_file);
                        fs.unlink(target_file);
                    });

                    read_stream.pipe(response);

                } else {
                    response_header['Content-Type'] = 'text/plain';
                    response.writeHead(500, response_header);
                    response.end();

                    app_log('[execFile error] ' + unique_id + ': error obj: ' + JSON.stringify(error));
                    app_log('[execFile error] ' + unique_id + ': error text: ' + error);
                    app_log('[execFile error] ' + unique_id + ': stderr: ' + stderr);
                    app_log('[execFile error] ' + unique_id + ': stdout: ' + stdout);
                }
            }

            execFile('wkhtmltopdf', wkhtmltopdf_options.concat([source_file, target_file]), {timeout: 20000}, pdf_response);
        });
    }
}

http.createServer(html_request).listen(HTTP_PORT);

app_log('[main] wkhtmltopdf running');
