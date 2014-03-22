module.exports = setup
module.exports.provides = ['broadcast']

function setup(plugin, imports, register) {
  register(null, {
    queue: require('./broadcast')
  })
}