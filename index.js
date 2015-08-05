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
  , MuxDmx = require('mux-dmx')

module.exports = setup
module.exports.provides = ['broadcast']

function setup(plugin, imports, register) {
  var syncStreams = {}
  var broadcasts = {}
    , channels = {}

  var Broadcast = {
    broadcast: {
      registerChannel: function(id, fn) {
        if(channels[id.toString('base64')]) return
        channels[id.toString('base64')] = fn
      }
    , document: function(docId, user) {
        var b = MuxDmx()
        if(!Array.isArray(broadcasts[docId])) broadcasts[docId] = []
        broadcasts[docId].push(b)

        Object.keys(channels).forEach(function(channel) {
          var id = new Buffer(channel, 'base64')
            , readable = b.createDuplexStream(id)
            , writable = through(function(buf, enc, cb) {
                if(Array.isArray(broadcasts[docId])) {
                  broadcasts[docId].forEach(function(s) {
                    if(s === b) return
                    s.createDuplexStream(id).write(buf)
                  })
                }
                cb()
              })
          channels[channel](user, docId, readable, writable)
        })

        b.on('end', function() {
          broadcasts[docId].splice(broadcasts[docId].indexOf(b), 1)
        })
        return b
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
