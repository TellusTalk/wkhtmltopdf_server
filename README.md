# wkhtmltopdf_server
(Node.js) Post any html file to this webserver and the response will be as pdf

# How to install:
1) Copy the file wkhtmltopdf_server.js to a directory on a (linux)computer with Node installed.

2) Change the variables declared at the top of the file with your values.

3) From the command line start the proxy as:
    $ node wkhtmltopdf_server.js

# How to install wkhtmltopdf
HomePage: http://wkhtmltopdf.org/

    $ cd  /usr/local/src
    $ sudo wget http://download.gna.org/wkhtmltopdf/0.12/0.12.2/wkhtmltox-0.12.2_linux-trusty-amd64.deb    (download the version you want)
    $ sudo dpkg -i wkhtmltox-0.12.2_linux-trusty-amd64.deb (Installs the package)

/*If you get dependencies problems*/
Try this first
    
        $ sudo apt-get -f install
Or install the missing dependencies manually
    dpkg: dependency problems prevent configuration of wkhtmltox:
     wkhtmltox depends on fontconfig; however:
      Package fontconfig is not installed.
     wkhtmltox depends on libjpeg-turbo8; however:
      Package libjpeg-turbo8 is not installed.
     wkhtmltox depends on xfonts-base; however:
      Package xfonts-base is not installed.
     wkhtmltox depends on xfonts-75dpi; however:
      Package xfonts-75dpi is not installed.

    From above you can install each dependency yourself
    $ sudo apt-get install fontconfig
    $ sudo apt-get install libjpeg-turbo8
    $ sudo apt-get install xfonts-base
    $ sudo apt-get install xfonts-75dpi
     
wkhtmltopdf and wkhtmltoimage where installed into /usr/local/bin

    $ wkhtmltopdf -V   (Print the version)
