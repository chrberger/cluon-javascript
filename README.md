# cluon-javascript
This project provides a minimum viable product (MVP) demonstrating how to communicate between JavaScript and [OD4Sessions](https://github.com/chalmers-revere/opendlv) using [libcluon](https://github.com/chrberger/libcluon) and hence, connecting JavaScript and C++ to exchange data bi-directionally.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT) [![x86_64/js](https://img.shields.io/badge/platform-x86_64-blue.svg)](https://hub.docker.com/r/chrberger/cluon-javascript-js-amd64/tags/) [![x86_64/cpp](https://img.shields.io/badge/platform-armhf-blue.svg)](https://hub.docker.com/r/chrberger/cluon-javascript-cpp-amd64/tags/)

## Table of Contents
* [Features](#features)
* [Dependencies](#dependencies)
* [Usage](#usage)
* [Building](#building)
* [License](#license)

## Features
* Written in highly portable and high quality C++14
* Sending data in [Protobuf](https://developers.google.com/protocol-buffers/) from C++ to your JavaScript application
* Sending data in [Protobuf](https://developers.google.com/protocol-buffers/) from JavaScript to your C++ application
* Available as Docker images for [x86_64/js](https://hub.docker.com/r/chrberger/cluon-javascript-js-amd64/tags/) and [x86_64/cpp](https://hub.docker.com/r/chrberger/cluon-javascript-cpp-amd64/tags/)

## Dependencies
No dependencies! You just need a C++14-compliant compiler to compile this
project as it ships its dependencies as part of the source distribution:

* [libcluon](https://github.com/chrberger/libcluon) - [![License: GPLv3](https://img.shields.io/badge/license-GPL--3-blue.svg
)](https://www.gnu.org/licenses/gpl-3.0.txt)

## Usage
1. Running the webserver to serve the JavaScript application serving data from [OD4Session](https://github.com/chalmers-revere/opendlv) `111`:
```
docker run --rm -ti --net=host chrberger/cluon-javascript-js-amd64:latest --cid=111
```

2. Running the C++ demo program to send data in time-triggered mode:
```
docker run --rm -ti --net=host chrberger/cluon-javascript-cpp-amd64:latest ping-pong --cid=111
```

Now, simply point your web-browser to http://localhost:8082 and open the JavaScript console to see the output.

## Building
To build these microservices, simply change in the respective folders.

1. Build the JavaScript application:
```
docker build -t js -f Dockerfile.amd64 .
```

2. Build the C++ application:
```
docker build -t cpp -f Dockerfile.amd64 .
```

## License

* This project is released under the terms of the MIT License.
