// 数据库操作构造函数
function LocalDB(dbName, tabelName) {
    this.dbName = dbName;
    this.tabelName = tabelName;
    this.db = null;
}

Object.assign(LocalDB.prototype, {
    // 打开数据库操作
    open(callback) {
        var _this = this;
        // 打开 indexedDB 数据库
        var request = window.indexedDB.open(_this.dbName);
        // 成功打开的回调
        request.onsuccess = function (e) {
            // 数据库实例
            _this.db = request.result;
            // 执行回调
            callback && callback();
        }

        // 当尝试打开一个版本号大于当前版本的数据库时触发
        request.onupgradeneeded = function (e) {
            // 数据库实例
            var db = request.result;

            // 存在指定的表,跳出
            if (db.objectStoreNames.contains(_this.tabelName)) return;

            // 不存在时进行创建,并设置自增的id作为查询依据
            db.createObjectStore(_this.tabelName, {
                keyPath: 'id',
                autoIncrement: true
            });
        }
    },

    // 获取数据表实例
    getStore() {
        var transaction = this.db.transaction(this.tabelName, 'readwrite');
        var objStore = transaction.objectStore(this.tabelName);

        return objStore;
    },

    // 保存一条数据，支持添加和修改
    set(data, callback) {
        var objStore = this.getStore();
        var request = data.id ? objStore.put(data) : objStore.add(data);
        request.onsuccess = function (e) {
            callback && callback(e.target.result);
        }
    },

    // 获取一条数据
    get (id, callback) {
        var objStore = this.getStore();
        var request = objStore.get(id);
        request.onsuccess = function (e) {
            callback && callback();
        }
    },

    // 删除数据
    remove(id) {
        var objStore = this.getStore();
        objStore.delete(id);
    },

    // 获取表中所有数据
    getAll(callback) {
        var objStore = this.getStore();
        // 打开数据游标
        var request = objStore.openCursor();
        request.onsuccess = function (e) {
            var cursor = e.target.result;
            if(cursor) {
                // 如果存在，执行回调并传入数据行
                callback && callback(cursor.value);
                // 继续下一行数据
                cursor.continue();
            }
        }
    },
});