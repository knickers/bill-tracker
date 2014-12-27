function IndexedDB(dbName, store) {
	this.db = null;
	this.name = dbName;
	this.store = store;
}

IndexedDB.prototype.onError = function(e) {
	console.log(e);
};

IndexedDB.prototype.open = function(version, callback) {
	var self = this;
	var request = indexedDB.open(this.name, version);
	request.onupgradeneeded = function(e) {
		var db = e.target.result;
		e.target.transaction.onerror = self.onError;
		
		if (db.objectStoreNames.contains(self.store)) {
			db.deleteObjectStore(self.store);
		}
		
		var store = db.createObjectStore(self.store, {
			keyPath: 'id'
		});
	};
	
	request.onsuccess = function(e) {
		self.db = e.target.result;
		callback();
	};
	request.onerror = this.onError;
};

IndexedDB.prototype.insert = function(data, callback) {
	var trans = this.db.transaction([this.store], 'readwrite');
	var request = trans.objectStore(this.store).put($.extend(data, {
		'id': new Date().getTime()
	}));
	
	trans.oncomplete = function(e) { callback(e.target.result); };
	request.onerror = this.onError;
};

IndexedDB.prototype.getAll = function(callback) {
	var trans = this.db.transaction([this.store], 'readonly');
	var range = IDBKeyRange.lowerBound(0);
	var request = trans.objectStore(this.store).openCursor(range);
	
	var items = [];
	request.onsuccess = function(e) {
		var result = e.target.result;
		if (!!result === false) {
			callback(items);
			return;
		}
		items.push(item);
		result.continue();
	};
	request.onerror = this.error;
};

IndexedDB.prototype.delete = function(id, callback) {
	var trans = this.db.transaction([this.store], 'readwrite');
	var request = trans.objectStore(this.store).delete(id);
	
	trans.oncomplete = function(e) { callback(e.target.result); };
	request.onerror = this.onError;
};

