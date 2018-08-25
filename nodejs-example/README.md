# cluon-javascript-js: Node.js
This sub-project contains the Node.js client the JavaScript--C++ communication demo.

Start the  [Node.js](https://nodejs.org/en/) version of the application by navigating into ``nodejs-example``, installing the dependencies with ``npm install`` and running:

```
node index.js
```

# Working with the example code
In this brief tutorial, you learn how to write a *libcluon* client for Node.js.

## Dependencies
Besides libcluon, the example Node.js client has the [websocket](https://www.npmjs.com/package/websocket) library as a dependency.
Set up your project with ``npm init`` and install the dependencies with ``npm install libcluon websocket --save``.

## Code
First, import all dependencies and run the ``libcluon`` initiation function:

```JavaScript
const fs = require('fs')

const libcluon = require('libcluon')
const WebSocketClient = require('websocket').w3cwebsocket
const __libcluon = libcluon()
```

Note that ``fs`` is a Node.js standard library for accessing the file system.

Then, add two helper functions for decoding and encoding base-64 ASCII strings:

```JavaScript
// Helper function to decode base-64 ASCII as String object
function atob(string) {
    if (Buffer.byteLength(string) !== string.length) {
        throw new Error(`bad string: ${string}`)
    }
    return new Buffer(string, 'base64').toString('binary')
}

// Helper function to encode String object as base-64 ASCII
function btoa(string) {
    if (Buffer.byteLength(string) !== string.length) {
        throw new Error(`bad string: ${string}`)
    }
    return Buffer(string, 'binary').toString('base64')
}
```

Note that you don't need to implement these functions when running a similar application from a web browser.

Keep the functions at the end of the file and add the following code above them.

Write an argument parser for optionally overwriting the default port and IP address the client connects to:

```JavaScript
// Set ip, port from args, else defaults
let ip, port
if (process.argv[2]) {
    ip = process.argv[2].split(':')[0]
    port = process.argv[2].split(':')[1] 
} else {
    ip = '127.0.0.1'
    port = '8082'
}
```

Next, connect to the websocket server:

```JavaScript
const url = `ws://${ip}:${port}/`
console.log(`Attempting to connect to ${url}...`)
// Read data in binary from the WebSocket, channel "od4".
const client = new WebSocketClient(`ws://${ip}:${port}/`, 'od4')
```

Now you can write the websocket handlers.
Log connection errors and closures:

```JavaScript
// Log failed connection attempts
client.onerror = function(error) {
    console.log('Failed to connect.')
}

// Log connection closure
client.onclose = function() {
    console.log('Connection is closed.')
}
```

When opening a connection, load and set the example ``odvd`` message specification:

```JavaScript
client.onopen = function() {
    console.log('Connected.')

    // Load the ODVD message specification file to have information about the messages to decode and encode.
    fs.readFile('../js-browser-example/example.odvd', {encoding: 'utf-8'}, (err, data) => {
        err ?
            console.log(err) :
            console.log(`Loaded${__libcluon.setMessageSpecification(data)} messages from specification.`)
    })
}
```

Finally, add a message handler that responds to all messages with the data type ``2221`` You find a detailed explanation of the message handler code in the [JavaScript browser tutorial](https://github.com/chrberger/cluon-javascript/blob/master/js/README.md):

```JavaScript
client.onmessage = function(evt) {
    console.log(evt.data)
    // Got new data from the WebSocket; now, try to decode it into JSON using the supplied message specification file.
    const data = JSON.parse(__libcluon.decodeEnvelopeToJSON(evt.data))
    console.log(data)

    // Check for message ID 2221...
    if (data.dataType == 2221) {
        // found message. Now, extract values from the fields and do something with the data...
        const number = data.example_Ping.number * 1.1

        const textInBase64 = data.example_Ping.text
        const textDecodedFromBase64 = atob(textInBase64)
        const textReversed = textDecodedFromBase64.split('').reverse().join('')

        // ...and reply with message ID 2222.
        {
            const replyTextInBase64 = btoa(textReversed)
            const replyInJSON = `{"text":"${replyTextInBase64}","number":${number}`

            // Transform JSON response into binary Protobuf-encoded data...
            const MESSAGE_ID = 2222
            const SENDER_STAMP = 0 // If you have multiple messages of the same type that you want to distinguish at the receiver, simply set the SENDER_STAMP to different values.
            const replyInProtobuf = __libcluon.encodeEnvelopeFromJSONWithoutTimeStamps(replyInJSON, MESSAGE_ID, SENDER_STAMP)

            // convert into uint8 array buffer...
            strToAB = str =>
                new Uint8Array(str.split('')
                .map(c => c.charCodeAt(0))).buffer

            // and send via the websocket.
            client.send(strToAB(replyInProtobuf), { binary: true })
        }
    }
}
```

## Running the example code
To run the example code, follow the instructions in the project's [main README](https://github.com/chrberger/cluon-javascript).

