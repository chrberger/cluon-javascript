# cluon-javascript-cpp
This sub-project contains the C++ part of the JavaScript--C++ communication demo.

## Table of Contents
* [Description](#description)
* [Dependencies](#dependencies)
* [Usage](#usage)
* [Building](#building)
* [License](#license)

## Description
The purpose of this sample program is demonstrate how to design a simple message
using the ODVD message specification from [libcluon](https://github.com/chrberger/libcluon)
to send a message from a C++ program via websockets to JavaScript. In a JavaScript
application, this message is received, unpacked, and responded to.

The first step is define the message; here, we use the file `example.odvd` in this
folder on the folder `js`. Apparently, these message files must match - otherwise,
the encoding and decoding of the messages will fail.

The next step is to transform this message specification into C++ using
`cluon-msc` - the message specification compiler from [libcluon](https://github.com/chrberger/libcluon).
The following steps are contained in the `CMakeLists.txt` file; they are described
here for the sake of completeness.

This compiler is contained in the single-file, header-only distribution. To compile
the message compiler from the header-only library, we set the compiler definition
`HAVE_CLUON_MSC`. As the GNU compiler does not allow to create executables from
a given .hpp file, we create a symbolic link to the single-file, header-only
`cluon-complete-v0.0.97.hpp` file:

```
ln -sf cluon-complete-v0.0.97.hpp cluon-complete.cpp
```

Now, we compile the executable for the message compiler using a C++14-compliant
compiler. The `cluon-msc` tool depends on pthreads on Linux.

```
g++ -DHAVE_CLUON_MSC -std=c++14 -pthread -o cluon-msc cluon-complete.cpp
```

Next, we create the C++ header file from our message specification file `example.odvd`:

```
./cluon-msc --cpp-headers --out=example.hpp example.odvd
```

Next, we create the C++ source file from our message specification file `example.odvd`;
in addition, we need to specify the file name of the header file that belongs to
it and that we just created before:

```
./cluon-msc --cpp-sources --out=example.cpp --cpp-add-include-file=example.hpp example.odvd
```

Now, we can create a simple C++ program, that is using an `OD4Session` to
exchange the messages that we just defined. Therefore, we simply create an
instance of class `OD4Session` that we pass a conference identifier (CID) that
must be identical to all microservices that are supposed to send and receive
messages with each other:

```c++
cluon::OD4Session od4{111};
```

In this case, all microservices belonging to CID 111 can see each other and
communicate with each other. Next, we define the a lambda that is called whenever
our program is receiving an `Envelope` of the desired type `example::Pong`. The
body of this lambda is simply unpacking the `Envelope` and printing the content
to `stdout`. The lambda is registered at the `OD4Session` for the message identifier
of `example::Pong`.

```c++
auto pong = [](cluon::data::Envelope &&env){
    example::Pong p = cluon::extractMessage<example::Pong>(std::move(env));
    std::cout << "Received: '" << p.text() << "', " << p.number() << std::endl;
};
od4.dataTrigger(example::Pong::ID(), pong);
```

Next, we add a time-triggered stimulus to trigger some computation at the
JavaScript application. Therefore, we define another lambda that we pass the
reference to the `OD4Session` so that we can access `send(...)` method. Furthermore,
we add a simple counter variable so that we can send some more meaningful data.
Finally, the time-triggered lambda needs to return `true` as long as it wants
to be kept executed; if it returns `false`, its time-triggered execution would end.

```c++
uint32_t counter{0};
auto ping = [&od4, &counter](){
    example::Ping p;
    p.number(counter).text("Hello World: " + std::to_string(counter++));
    od4.send(p);
    return true;
};

const float RUN_AT_TWO_HERTZ{2.0f};
od4.timeTrigger(RUN_AT_TWO_HERTZ, ping); // Won't return until the lambda returns false.
```

## Dependencies
No dependencies! You just need a C++14-compliant compiler to compile this
project as it ships its dependencies as part of the source distribution:

* [libcluon](https://github.com/chrberger/libcluon) - [![License: GPLv3](https://img.shields.io/badge/license-GPL--3-blue.svg
)](https://www.gnu.org/licenses/gpl-3.0.txt)

## Usage
This microservice is provided via Docker's public registry for:
* [![x86_64/cpp](https://img.shields.io/badge/cpp-x86_64-blue.svg)](https://hub.docker.com/r/chrberger/cluon-javascript-cpp-amd64/tags/)
* [![armhf/cpp](https://img.shields.io/badge/cpp-armhf-blue.svg)](https://hub.docker.com/r/chrberger/cluon-javascript-cpp-armhf/tags/)

Running the C++ demo program to send data in time-triggered mode:
```
docker run --rm -ti --net=host chrberger/cluon-javascript-cpp-amd64:latest ping-pong --cid=111
```

You can check whether this program works properly by using [`cluon-livefeed`](https://github.com/chrberger/cluon-livefeed):
```
docker run --rm -ti --init --net=host -v $PWD:/opt chrberger/cluon-livefeed-multi:v0.0.89 --cid=111 --odvd=/opt/example.odvd
```

## Building

To natively build this demo program, simply compile it using a C++14-compliant compiler:

1. Create and change to an out-of-source build folder:
```
mkdir build && cd build
```

2. Run `cmake` to create the build files:
```
cmake ..
```

3. Build the C++ application:
```
make
```

## License

* This project is released under the terms of the MIT License.
