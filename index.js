/**
 * hive.js
 * Copyright (C) 2013-2015 Marcel Klehr <mklehr@gmx.net>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
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
