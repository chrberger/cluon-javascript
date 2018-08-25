const fs = require('fs')

const libcluon = require('libcluon')
const WebSocketClient = require('websocket').w3cwebsocket
const __libcluon = libcluon()

// Set ip, port from args, else defaults
let ip, port
if (process.argv[2]) {
    ip = process.argv[2].split(':')[0]
    port = process.argv[2].split(':')[1] 
} else {
    ip = '127.0.0.1'
    port = '8082'
}

const url = `ws://${ip}:${port}/`
console.log(`Attempting to connect to ${url}...`)
// Read data in binary from the WebSocket, channel "od4".
const client = new WebSocketClient(`ws://${ip}:${port}/`, 'od4')

// Log failed connection attempts
client.onerror = function(error) {
    console.log('Failed to connect.')
}

client.onopen = function() {
    console.log('Connected.')

    // Load the ODVD message specification file to have information about the messages to decode and encode.
    fs.readFile('../js-browser-example/example.odvd', {encoding: 'utf-8'}, (err, data) => {
        err ?
            console.log(err) :
            console.log(`Loaded${__libcluon.setMessageSpecification(data)} messages from specification.`)
    })
}

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

// Log connection closure
client.onclose = function() {
    console.log('Connection is closed.')
}

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
