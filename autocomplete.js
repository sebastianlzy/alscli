const omelette = require('omelette');
const commands = require('./commands')

function mapCommandsToAutoComplete(commands) {

    const mainCommands = Object.keys(commands)
    const autoCompleteTree = {}

    mainCommands.map((mainCommand) => {
        autoCompleteTree[mainCommand] = Object.keys(commands[mainCommand])
    })

    return autoCompleteTree
}

omelette('alscli').tree(mapCommandsToAutoComplete(commands)).init()
