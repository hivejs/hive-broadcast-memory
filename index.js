var through = require('through2')
  , duplexify = require('duplexify')
  , PassThrough = require('stream').PassThrough

module.exports = setup
module.exports.provides = ['broadcast']

function setup(plugin, imports, register) {
  var syncStreams = {}
  var broadcasts = {}

  var Broadcast = {
    broadcast: {
      broadcast: function(docId) {
        var readBroadcast = new PassThrough
        if(!Array.isArray(broadcasts[docId])) broadcasts[docId] = []
        broadcasts[docId].push(readBroadcast)
        var stream = duplexify(through(function(buf, enc, cb) {
          if(Array.isArray(broadcasts[docId])) {
            broacasts[docId].forEach(function(s) {
              if(s === readBroadcast) return
              s.write(buf)
            })
          }
          cb()
        }), readBroadcast)
        stream.on('end', function() {
          broadcasts[docId].splice(broadcasts[docId].indexOf(readBroadcast))
        })
        return stream
      }
    , sync: function(docId) {
        return through(function(buf, enc, cb) {
          cb()
        })
      }
    }
  }
  register(null, Broadcast)
}
