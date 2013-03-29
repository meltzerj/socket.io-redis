/**
 * Module dependencies.
 */

 var Adapter = require('../socket.io/lib/adapter')
   , redis = require('../socket.io/node_modules/redis')
   , base64id = require('../socket.io/node_modules/engine.io/node_modules/base64id')
   , msgpack = require('msgpack');

/**
 * Module exports.
 */

module.exports = RedisAdapter;

/**
 * Redis adapter constructor.
 *
 * @param {Namespace} nsp
 * @api public
 */

function RedisAdapter(nsp){
	this.parent = Adapter;
	parent.call(this, nsp);
	this.subscriptions = {};
	this.pack = msgpack.pack;
	this.unpack = msgpack.unpack;
	this.pub = redis.createClient();
	this.sub = redis.createClient();
	this.nodeId = this.generateNodeId();
	this.listenForMessages();
}

/**
* Inherits from Adapter
*/

RedisAdapter.prototype.__proto__ = Adapter.prototype;

RedisAdapter.prototype.generateNodeId = function(){
	/**
	 *  TODO: create a separate library that generates a truly unique id for a node process
	 *        using network IP address and port as inputs
	 */ 
	return base64id.generateId();
};

RedisAdapter.prototype.add = function(id, room){
	this.subscribe(room);
	this.parent.prototype.add.apply(this, arguments);
};

RedisAdapter.prototype.subscribe = function(room){
	if (!this.subscriptions[room]) {
		this.sub.subscribe(room);
		this.subscriptions[room] = true;
	}
};

RedisAdapter.prototype.del = function(id, room){
	this.parent.prototype.del.apply(this, arguments);
	this.unsubscribe(room);
};

RedisAdapter.prototype.delAll = function(id){
	var rooms = this.sids[id];
	if (rooms) {
		for (var room in rooms) {
			this.unsubscribe(room);
		}
	}

	this.parent.prototype.delAll.apply(this, arguments);
};

RedisAdapter.prototype.unsubscribe = function(roomLeft){
	function socketsInRoom() {
		var roomIds = this.rooms[roomLeft]
		  , flag = false;

		roomIds.some(function(id){
			if (typeof id === 'string') {
				flag = true;
				return flag;
			}
		});

		return flag;
	}

	if (!socketsInRoom()) {
		this.sub.unsubscribe(roomLeft);
		delete this.subscriptions[room];
	}
};

RedisAdapter.prototype.broadcast = function(packet, opts){
	var self = this;
	var rooms = opts.rooms || [];
	var message = {nodeId: this.nodeId, data: packet};
	rooms.forEach(function(room){
		self.pub.publish(room, self.pack(message));
	});
	this.parent.prototype.broadcast.apply(this, arguments);
};

RedisAdapter.prototype.listenForMessages = function(){
	var self = this;
	this.sub.on('message', function(room, message){
		var message = self.unpack(message)
		  , data = message.data
		  , nodeId = message.nodeId;

		// only broadcast locally if received message was not sent by the same process  
		if (nodeId !== self.nodeId) {
			self.parent.prototype.broadcast(data, {
				except: [],
				rooms: [room],
				flags: []
			});
		}  

	});
};
