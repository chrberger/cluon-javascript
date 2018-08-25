# cluon-javascript

 [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

*cluon-javascript* is the JavaScript version of [cluon](https://github.com/chrberger/libcluon), a C++ library to connect microservices with minimal overhead.
The JavaScript library is auto-compiled from the C++ version.

To install *cluon-javascript*, run:

```
npm install libcluon
```

or:

```
yarn add libcluon
```
.

## Table of Contents
* [Features](#features)
* [Dependencies](#dependencies)
* [Usage example](#usage-example)
* [Building](#building)
* [License](#license)

## Features
* Written in highly portable and high quality C++14
* Sending data in [Protobuf](https://developers.google.com/protocol-buffers/) from C++ to your JavaScript application
* Sending data in [Protobuf](https://developers.google.com/protocol-buffers/) from JavaScript to your C++ application
* Description of the [C++](https://github.com/chrberger/cluon-javascript/blob/master/cpp/README.md) part of this ping-pong application
* Description of the [JavaScript](https://github.com/chrberger/cluon-javascript/blob/master/js/README.md) part of this ping-pong application

## Dependencies
No dependencies! You just need a C++14-compliant compiler to compile this
project as it ships its dependencies as part of the source distribution:

* [libcluon](https://github.com/chrberger/libcluon) - [![License: GPLv3](https://img.shields.io/badge/license-GPL--3-blue.svg
)](https://www.gnu.org/licenses/gpl-3.0.txt)

**Note:**: If you want to install the Node.js example we provide, some additional dependencies will be installed. However, these are dependencies of the Node.js example and not of *cluon-javascript* itself.

## Usage example
This project provides a minimum viable product (MVP) demonstrating how to communicate between JavaScript and [OD4Sessions](https://github.com/chalmers-revere/opendlv) using [libcluon](https://github.com/chrberger/libcluon) and hence, connecting JavaScript and C++ to exchange data bi-directionally.

 [![x86_64/js](https://img.shields.io/badge/js-x86_64-blue.svg)](https://hub.docker.com/r/chrberger/cluon-javascript-js-amd64/tags/) [![x86_64/cpp](https://img.shields.io/badge/cpp-x86_64-blue.svg)](https://hub.docker.com/r/chrberger/cluon-javascript-cpp-amd64/tags/) [![armhf/js](https://img.shields.io/badge/js-armhf-blue.svg)](https://hub.docker.com/r/chrberger/cluon-javascript-js-armhf/tags/) [![armhf/cpp](https://img.shields.io/badge/cpp-armhf-blue.svg)](https://hub.docker.com/r/chrberger/cluon-javascript-cpp-armhf/tags/)

This microservice is provided via Docker's public registry for:
* [![x86_64/js](https://img.shields.io/badge/js-x86_64-blue.svg)](https://hub.docker.com/r/chrberger/cluon-javascript-js-amd64/tags/)
* [![x86_64/cpp](https://img.shields.io/badge/cpp-x86_64-blue.svg)](https://hub.docker.com/r/chrberger/cluon-javascript-cpp-amd64/tags/)
* [![armhf/js](https://img.shields.io/badge/js-armhf-blue.svg)](https://hub.docker.com/r/chrberger/cluon-javascript-js-armhf/tags/)
* [![armhf/cpp](https://img.shields.io/badge/cpp-armhf-blue.svg)](https://hub.docker.com/r/chrberger/cluon-javascript-cpp-armhf/tags/)

1.  Start the webserver that hosts the JavaScript front end that serves the data from [OD4Session](https://github.com/chalmers-revere/opendlv) `111`:

    ```
    docker run --rm -ti --net=host chrberger/cluon-javascript-js-amd64:latest --cid=111
    ```

2.  Run the C++ demo program to send data in time-triggered mode:

    ```
    docker run --rm -ti --net=host chrberger/cluon-javascript-cpp-amd64:latest ping-pong --cid=111
    ```

    Now, simply point your web-browser to http://localhost:8082 and open the JavaScript console to see the output.

3.  **Optionally**, you can also run the [Node.js](https://nodejs.org/en/) version of the application by navigating into
    ``nodejs-example``, installing the dependencies with ``npm install`` and running ``node index.js`` (default IP and port), or ``node index.js <ip>:<port>``, e.g. ``node index.js 192.168.99.100:8082``.
    ```

## Building
* Description of the [C++](https://github.com/chrberger/cluon-javascript/blob/master/cpp-example/README.md) part of the ping-pong application
* Description of the [JavaScript](https://github.com/chrberger/cluon-javascript/blob/master/js-example/README.md) front end part of the ping-pong application
* Description of the [Node.js](https://github.com/chrberger/cluon-javascript/blob/master/nodejs-example/README.md) client for the ping-pong application

## License

* This project is released under the terms of the MIT License.
