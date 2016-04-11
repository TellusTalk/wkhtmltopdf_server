var
    PASSPHRASE = 'Some Secret!',
    HTTP_PORT = 7201;

var
    http = require('http');

function app_log(text_in) {
    'use strict';
    console.log('[' + (new Date()).toISOString() + ']');
    console.log(text_in);
}

function html_request(request, response) {
    'use strict';
    var
        unique_id = new Date().toISOString() + '_' + Math.floor(Math.random() * 1000),
        wkhtmltopdf_options = request.headers.wkhtmltopdf_options ? request.headers.wkhtmltopdf_options.split(' ') : ['--quiet'],
        spawn_wkhtmltopdf;

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
        try {
	        spawn_wkhtmltopdf = require('child_process').spawn('/bin/sh', ['-c', 'wkhtmltopdf ' + wkhtmltopdf_options + ' - - | cat']);
	
	        request.pipe(spawn_wkhtmltopdf.stdin);
	        response.writeHead(200, {'Content-Type': 'application/pdf'});
	        spawn_wkhtmltopdf.stdout.pipe(response);
	    } catch (err) {
	        response.writeHead(400, {'Content-Type': 'text/plain'});
	        response.write(err.message);
	        response.write('\n----------------------------\n');
	        response.write(err.stack);
	        response.end();
	        return;
	    }
    }
}

http.createServer(html_request).listen(HTTP_PORT);

app_log('[main] wkhtmltopdf running');
