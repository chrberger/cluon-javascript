# cluon-javascript-js
This sub-project contains the JavaScript part of the JavaScript--C++ communication demo.

## Table of Contents
* [Description](#description)
* [Dependencies](#dependencies)
* [Usage](#usage)
* [Building](#building)
* [License](#license)

## Description
The purpose of this sample program is demonstrate how to design a simple message
using the ODVD message specification from [libcluon](https://github.com/chrberger/libcluon)
to send a message from a C++ program via WebSockets to JavaScript. In a JavaScript
application, this message is received, unpacked, and responded to.

First, a recent version of [libcluon](https://github.com/chrberger/libcluon) needs
to be added; a complete list of current version is available here: https://bintray.com/chrberger/libcluon/javascript#files

```javascript
<script src="libcluon-v0.0.97.js"></script>
```

Next, you need to set a handle to [libcluon](https://github.com/chrberger/libcluon)
so that you can access the built-in functions:

```javascript
var __libcluon = libcluon();
```

As our JavaScript application will dynamically load the message specification that
we want to use; therefore, we add a small function that allows us to load a
`.odvd` file:

```javascript
function getResourceFrom(url) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", url, false /*asynchronous request*/);
    xmlHttp.send(null);
    return xmlHttp.responseText;
}
```

Next, we activate a WebSocket connection; the second parameter declares the protocol
that we want to use. In our JavaScript-C++ application, we are using the `od4`
protocol that provides Protobuf-encoded `cluon::data::Envelope`s. Furthermore,
we want to process the data as arraybuffer:

```javascript
var ws = new WebSocket("ws://" + window.location.host + "/", "od4");
ws.binaryType = 'arraybuffer';
```

Next, we load the ODVD message specification file to have information about the
messages to decode and encode:

```javascript
var odvdMessageSpecificationFile = getResourceFrom("example.odvd");
console.log("Loaded " + __libcluon.setMessageSpecification(odvdMessageSpecificationFile) + " messages from specification.");
```

Now, we need to define a handler to react on newly arriving data from the WebSocket.
As the data is handed via the WebSocket as Protobuf-encoded bytes, we use
[libcluon](https://github.com/chrberger/libcluon) to transform them into a JSON
object to work with that subsequently:

```javascript
ws.onmessage = function(evt) {
    var data = JSON.parse(__libcluon.decodeEnvelopeToJSON(evt.data));
    console.log(data);
...
```

The example message specification contains a `string` field next to a numerical
type. [libcluon](https://github.com/chrberger/libcluon) transcodes all `string`
fields into Base64-encoded representations and hence, we need to turn the
Base64-encoded `string` into a readable representation:

```javascript
var textInBase64 = data.example_Ping.text;
var textDecodedFromBase64 = window.atob(textInBase64);
```

To send data from JavaScript back to the C++ `OD4Session`, we go the reverse way.
First, we encode the `string` field back into Base64 encoding:
```javascript
var replyTextInBase64 = window.btoa(textReversed);
```

Next, we compose our response as JSON object; here, it is important that the field
names match with the fields specified in the ODVD file:
```javascript
var replyInJSON = "{\"text\":\"" + replyTextInBase64 + "\",\"number\":" + number  + "}";
```

Next, we transform this JSON object into the corresponding binary Protobuf-encoded
data representation. As the JSON object will be transformed as payload in the
`cluon::data::Envelope`, we need to provide the corresponding message identifier
from the ODVD message specification. If you have multiple messages of the same
type to be sent that you want to distinguish at the receiver end, simply us the
`SENDER_STAMP` to different values.
```javascript
const MESSAGE_ID = 2222;
const SENDER_STAMP = 0;
var replyInProtobuf = __libcluon.encodeEnvelopeFromJSONWithoutTimeStamps(replyInJSON, MESSAGE_ID, SENDER_STAMP);
```

Finally, we convert the resulting binary representation into `uint8 array buffer`
to be sent via the WebSocket:
```javascript
strToAB = str =>
 new Uint8Array(str.split('')
   .map(c => c.charCodeAt(0))).buffer;

ws.send(strToAB(replyInProtobuf), { binary: true });
```

## Dependencies
No dependencies! You just need a modern JavaScript-engine to interpret `libcluon.js`.

* [libcluon](https://github.com/chrberger/libcluon) - [![License: GPLv3](https://img.shields.io/badge/license-GPL--3-blue.svg
)](https://www.gnu.org/licenses/gpl-3.0.txt)

## Usage
This microservice is provided via Docker's public registry for:
* [![x86_64/js](https://img.shields.io/badge/js-x86_64-blue.svg)](https://hub.docker.com/r/chrberger/cluon-javascript-js-amd64/tags/)
* [![armhf/js](https://img.shields.io/badge/js-armhf-blue.svg)](https://hub.docker.com/r/chrberger/cluon-javascript-js-armhf/tags/)

Running the JavaScript demo program to send data in time-triggered mode; the last
parameter `--cid=111` provides the `OD4Session` conference identifier that must
match with the one used in the C++ part of this application:

```
docker run --rm -ti --net=host chrberger/cluon-javascript-js-amd64:latest --cid=111
```

Now, point your web-browser to http://localhost:8082.

## Building
To build this microservice, simply build it using Docker:

```
docker build -t javascript-example -f Dockerfile.amd64 .
```

Then, you can run your microservice:

```
docker run --rm -ti --net=host javascript-example:latest --cid=111
```

## License

* This project is released under the terms of the MIT License.
