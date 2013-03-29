socket.io-redis
===============

A Redis Adapter for the new Socket.io - used to broadcast messages to rooms across multiple node servers

### Why use it?

When using Socket.io in conjunction with multiple node servers, you need a way to communicate across those servers when dealing with rooms. For example, let's say you have multiple clients that each connect to one of your socket.io servers at random and all join the same room. If you want one of those clients to broadcast a message to all other clients in that same room, then you first send the message from that client to the server it has a persistent connection with. The next step is to then route that message to all other clients in that room, but it is possible that some of those clients are connected to a different server. That's where this library comes in. This library will right away emit the message to all clients in the room on this particular server, but will also publish it to a centralized Redis database. Then each node process that has at least one client in that room will receive the message from that room subscription and emit the message to all clients connected to that process' server.

### Usage

When attaching your existing http server to Socket.io or creating a new websocket server with Socket.io, simply require the Redis Adapter and pass it to Socket.io as an option like so:

```js
var RedisAdapter = require('socket.io-redis');
var server = require('http').Server();
var io = require('socket.io')(server, {adapter: RedisAdapter});
```