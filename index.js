var through = require('through2')

module.exports = setup
module.exports.provides = ['broadcast']

function setup(plugin, imports, register) {
  var docStreams = {}
    , syncStreams = {}

  var Broadcast = {
    broadcast: {
      document: function(docId) {
        if(!docStreams[docId]) {
          docStreams[docId] = through(function(buf, enc, cb) {
            this.push(buf)
            cb()
          })
        }
        return docStreams[docId]
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
