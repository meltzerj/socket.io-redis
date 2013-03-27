/**
 * Module dependencies.
 */

 var Adapter = require('socket.io/lib/adapter');

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
}

/**
* Inherits from Adapter
*/

RedisAdapter.prototype.__proto__ = Adapter.prototype;

RedisAdapter.prototype.add = function(){
	this.parent.prototype.add.apply(this, arguments);
};

RedisAdapter.prototype.del = function(){
	this.parent.prototype.del.apply(this, arguments);
};

RedisAdapter.prototype.delAll = function(){
	this.parent.prototype.delAll.apply(this, arguments);
};

RedisAdapter.prototype.broadcast = function(){
	
};
