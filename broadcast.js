var DuplexStream = require('stream').Duplex
/**
 * Interface: A factory producing broadcasts (duplex streams) per document
 * which output newly processed changesets in real-time and consume them to broadcast them.
 *
 * At all times, there should only be one entity that writes to a broadcast, but there may be multiple consumers.
 */

var streams = {}

module.exports = function broadcastFactory(docId) {
  if(streams[docId]) return streams[docId]

  var s = new DuplexStream({objectMode: true})

  s._read = function() {}

  s._write = function (pendingCs, enc, callback) {
    // If we push()'ed here, we'd apply the same edit twice
    // so we don't do anything
    callback()
  }

  return s
}
