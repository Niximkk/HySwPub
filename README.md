# HySwPub
```
              __           ___       _
  /\  /\_   _/ _\_      __/ _ \_   _| |__
 / /_/ / | | \ \\ \ /\ / / /_)/ | | | '_ \
/ __  /| |_| |\ \\ V  V / ___/| |_| | |_) |
\/ /_/  \__, \__/ \_/\_/\/     \__,_|_.__/
        |___/ PoC BETA
```
**HySwPub** is a **proof of concept (PoC)** for a decentralized peer-to-peer (P2P) botnet using [Hyperswarm](https://github.com/holepunchto/hyperswarm). This project demonstrates how nodes (referred to as "clients" and "slaves") can discover each other and communicate through topic-based networking.

> ⚠️ **DISCLAIMER:**
> This project is intended **solely for educational and research purposes**.
> The author **does not condone or support any form of malicious activity**.
> **You are fully responsible** for how you choose to use this code.


## 🧪 Features

* Decentralized command-and-control using Hyperswarm
* Topic-based peer discovery (`client` and `slave` roles)
* Heartbeat system for client/slave status tracking
* Remote command execution on slave peers
* Real-time CLI feedback and connection status

## ⚙️ Installation

```bash
git clone https://github.com/Niximkk/hyswpub.git
cd hyswpub
npm install
```

## 🪶 Usage

### Start a Client Node

```bash
node client.js
```

This will:

* Join both client and slave topics
* Provide a command-line interface
* Send commands to all connected slave nodes

### Start a Slave Node

```bash
node slave.js
```

This will:

* Join the slave topic
* Respond to heartbeats
* Execute commands received from the client

## ❗ Important Notes

* Commands sent from the client are executed directly on the system of the slave. **Use with caution.**
* The client prints the number of connected clients and slaves in the terminal title.
* This project is a **PoC** and lacks robust security features (encryption, authentication, etc.).


## 🛡️ Legal Disclaimer

This code is provided **"as is"** without any warranties.
It is designed strictly for **educational** and **demonstrative** purposes.
The author **is not responsible** for any damages or legal consequences resulting from misuse.

---

Copyleft (C) 2025 Nix

This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.


<p align="center">
  <a href="https://emoji.gg/emoji/5349-hellokittybyebye">
    <img src="https://cdn3.emoji.gg/emojis/5349-hellokittybyebye.png" width="128px" height="128px" alt="HelloKittyByeBye">
  </a>
</p>