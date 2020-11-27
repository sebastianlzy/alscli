const { Command } = require('commander');
const program = new Command();
const exec = require('child_process').exec;
const commands = require('./commands')

program.version('0.0.1');

function execShellCommand(shellCommand) {
    const child = exec(shellCommand,
        function (error, stdout, stderr) {
            // console.info(stdout);
            // console.error(stderr);
            if (error !== null) {
                console.error('exec error: ' + error);
            }
        });

    child.stdout.on('data', function(data) {
        console.log(data.toString());
    });
    child.stderr.on('data', function(data) {
        console.error(data);
    });
}

function addToCommand (mainCommand, subCommands) {
    Object.keys(subCommands).map((commandKey) => {

        mainCommand
            .command(commandKey)
            .action(() => {
                if (typeof subCommands[commandKey] == "function" ) {

                }
                execShellCommand(subCommands[commandKey])
            })
    })
}

function createCommand () {
    const mainCommands = []
    Object.keys(commands).map((mainCommandKey) => {
        const mainCommand = new Command(mainCommandKey)
        addToCommand(mainCommand, commands[mainCommandKey])
        mainCommands.push(mainCommand)
    })

    mainCommands.map((mainCommand) => {
        program.addCommand(mainCommand)
    })
}

createCommand()

program.parse(process.argv);

module.exports.commands = commands