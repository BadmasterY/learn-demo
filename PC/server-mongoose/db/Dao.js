/**
 * Dao 
 * 这里为基础类, 一个面向对象的数据库接口
 */
class Dao {
    /**
     * 需要创建好的模型
     */
    constructor(model) {
        if(!model) throw new Error(`Paramer 'model' not found.`);
        this.Model = model;
    }

    /**
     * 创建数据,
     * 使用 model.create()
     * @param {Object} obj 需要添加的数据
     */
    create(obj) {
        return new Promise((resolve, reject) => {
            const newModel = new this.Model(obj); // 创建一个对应模型的实例
            // 调用模型上的 create 方法, 实际触发 save 中间件
            // 详情: https://mongoosejs.com/docs/api/model.html#model_Model.create
            this.Model.create(newModel, (err, result) => {
                if(!err) {
                    resolve(result);
                } else {
                    reject(err);
                }
            });
        });
    }

    /**
     * 创建数据,
     * 使用 model.prototype.save()
     * @param {Object} obj 需要添加的数据
     */
    save(obj) {
        return new Promise((resolve, reject) => {
            const newModel = new this.Model(obj); // 创建一个对应模型的实例
            // 触发 prototype.save 方法
            // 详情: https://mongoosejs.com/docs/api/model.html#model_Model-save
            newModel.save((err, result) => {
                if(!err) {
                    resolve(result);
                } else {
                    reject(err);
                }
            });
        });
    }


    /**
     * 查找所有匹配的数据
     * @param {Object} filter 可选, 查询条件, 如果不输入将返回所有
     * @param {Object | String} projection 可选, 要返回的字段, 默认 null
     * @param {Object} options 可选, 选项, 默认 {}
     */
    findAll(filter = {}, projection = null, options = {}) {
        return new Promise((resolve, reject) => {
            // find 方法获取数据
            // 详情: https://mongoosejs.com/docs/api/model.html#model_Model.find
            this.Model.find(filter, projection, options, (err, result) => {
                if(!err) {
                    resolve(result);
                } else {
                    reject(err);
                }
            });
        });
    }

    /**
     * 查找匹配的第一条数据
     * @param {Object} filter 必须, 查询条件
     * @param {Object | String} projection 可选, 要返回的字段, 默认 null
     * @param {Object} options 可选, 选项, 默认 {}
     */
    findOne(filter, projection = null, options = {}) {
        if(!filter) throw new Error(`Paramer 'filter' not found.`);
        return new Promise((resolve, reject) => {
            // 使用 findOne 方法查找第一条匹配数据
            // 详情: https://mongoosejs.com/docs/api/model.html#model_Model.findOne
            this.Model.findOne(filter, projection, options, (err, result) => {
                if(!err) {
                    resolve(result);
                } else {
                    reject(err);
                }
            });
        });
    }

    /**
     * 更新多个
     * @param {Object} filter 可选, 匹配条件, 如果不输入将匹配所有, 默认 {}
     * @param {Object} doc 可选, 更新内容, 默认 {}
     * @param {Object} options 可选, 选项, 默认 {}
     */
    updateMany(filter = {}, doc = {}, options = {}) {
        return new Promise((resolve, reject) => {
            // 使用 updateMany 进行更新
            // 详情: https://mongoosejs.com/docs/api/model.html#model_Model.updateMany
            this.Model.updateMany(filter, doc, options, (err, result) => {
                if(!err) {
                    resolve(result);
                } else {
                    reject(err);
                }
            });
        });
    }

    /**
     * 仅更新匹配的第一项
     * @param {Object} filter 可选, 匹配条件, 如果不输入将匹配所有, 默认 {}
     * @param {Object} doc 可选, 更新内容, 默认 {}
     * @param {Object} options 可选, 选项, 默认 {}
     */
    updateOne(filter = {}, doc = {}, options = {}) {
        return new Promise((resolve, reject) => {
            // 使用 updateOne 进行更新
            // 详情: https://mongoosejs.com/docs/api/model.html#model_Model.updateOne
            this.Model.updateOne(filter, doc, options, (err, result) => {
                if(!err) {
                    resolve(result);
                } else {
                    reject(err);
                }
            });
        });
    }

    /**
     * 删除所有匹配项(物理删除)
     * @param {Object} filter 可选, 匹配条件, 如果不输入将匹配所有, 默认 {}
     * @param {Object} options 可选, 选项, 默认 {}
     */
    deleteMany(filter = {}, options = {}) {
        return new Promise((resolve, reject) => {
            // 使用 deleteMany 进行删除
            // 详情: https://mongoosejs.com/docs/api/model.html#model_Model.deleteMany
            this.Model.deleteMany(filter, options, (err, result) => {
                if(!err) {
                    resolve(result);
                } else {
                    reject(err);
                }
            });
        });
    }

    /**
     * 删除匹配的第一项(物理删除)
     * @param {Object} filter 可选, 匹配条件, 如果不输入将匹配所有, 默认 {}
     * @param {Object} options 可选, 选项, 默认 {}
     */
    deleteOne(filter = {}, options = {}) {
        return new Promise((resolve, reject) => {
            // 使用 deleteOne 进行删除
            // 详情: https://mongoosejs.com/docs/api/model.html#model_Model.deleteOne
            this.Model.deleteOne(filter, options, (err, result) => {
                if(!err) {
                    resolve(result);
                } else {
                    reject(err);
                }
            });
        });
    }

};

module.exports = { Dao };