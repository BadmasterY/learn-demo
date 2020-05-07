import { Model, Error, Document, MongooseDocument } from "mongoose";

/**
 * Dao 
 * 这里为基础类, 一个面向对象的数据库接口
 */
class Dao{

    Model: Model<Document>;

    /**
     * 需要创建好的模型
     */
    constructor(model: Model<Document>) {
        if(!model) throw new Error(`Paramer 'model' not found.`);
        this.Model = model;
    }
    
    /**
     * 创建数据,
     * 使用 model.create()
     * @param {Docs} obj 需要添加的数据
     */
    create(obj: MongooseDocument): Promise<any> {
        return new Promise((resolve, reject) => {
            const newModel = new this.Model(obj); // 创建一个对应模型的实例
            // 调用模型上的 create 方法, 实际触发 save 中间件
            // 详情: https://mongoosejs.com/docs/api/model.html#model_Model.create
            this.Model.create(newModel, (err: Error, result: any) => {
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
    save(obj: object): Promise<any> {
        return new Promise((resolve, reject) => {
            const newModel: Document = new this.Model(obj); // 创建一个对应模型的实例
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
    findAll(filter = {}, projection: null | string = null, options = {}): Promise<any[]> {
        return new Promise((resolve, reject) => {
            // find 方法获取数据
            // 详情: https://mongoosejs.com/docs/api/model.html#model_Model.find
            this.Model.find(filter, projection, options, (err: Error, result) => {
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
    findOne(filter: object, projection = null, options = {}): Promise<any> {
        if(!filter) throw new Error(`Paramer 'filter' not found.`);
        return new Promise((resolve, reject) => {
            // 使用 findOne 方法查找第一条匹配数据
            // 详情: https://mongoosejs.com/docs/api/model.html#model_Model.findOne
            this.Model.findOne(filter, projection, options, (err: Error, result) => {
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
    updateMany(filter = {}, doc = {}, options = {}): Promise<any> {
        return new Promise((resolve, reject) => {
            // 使用 updateMany 进行更新
            // 详情: https://mongoosejs.com/docs/api/model.html#model_Model.updateMany
            this.Model.updateMany(filter, doc, options, (err: Error, result) => {
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
    updateOne(filter = {}, doc = {}, options = {}): Promise<any> {
        return new Promise((resolve, reject) => {
            // 使用 updateOne 进行更新
            // 详情: https://mongoosejs.com/docs/api/model.html#model_Model.updateOne
            this.Model.updateOne(filter, doc, options, (err: Error, result) => {
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
    deleteMany(filter = {}, options = {}): Promise<any> {
        return new Promise((resolve, reject) => {
            // 使用 deleteMany 进行删除
            // 详情: https://mongoosejs.com/docs/api/model.html#model_Model.deleteMany
            this.Model.deleteMany(filter, options, (err: Error) => {
                if(!err) {
                    resolve();
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
    deleteOne(filter = {}, options = {}): Promise<any> {
        return new Promise((resolve, reject) => {
            // 使用 deleteOne 进行删除
            // 详情: https://mongoosejs.com/docs/api/model.html#model_Model.deleteOne
            this.Model.deleteOne(filter, options, (err: Error) => {
                if(!err) {
                    resolve();
                } else {
                    reject(err);
                }
            });
        });
    }

    /**
     * 多表联查
     * @param aggregations 可选, 联查配置
     */
    aggregate(aggregations = ([] as any[])): Promise<any[]> {
        return new Promise((resolve, reject) => {
            // 使用 aggregate 进行多表联查
            // 使用 $lookup
            // 详情: http://www.mongoosejs.net/docs/api.html#Aggregate
            this.Model.aggregate(aggregations, (err: Error, result: any) => {
                if(!err) {
                    resolve(result);
                } else {
                    reject(err);
                }
            });
        });
    }

};

export {
    Dao
};