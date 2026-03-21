class BaseService {
    constructor(model){
        this.model = model
    }
    async create(data) {
        try {
            const dataObj = new this.model(data)
            return await dataObj.save()
        } catch (exception) {
            throw exception
        }
    }

    async getSingleRowByFilter(filter) {
        try {
            const data = await this.model.findOne(filter)
            // .populate("createdBy", ['_id', 'title', "email", "image", "role", "status"])
            // .populate("updatedBy", ['_id', 'title', "email", "image", "role", "status"])
            return data;
        } catch (exception) {
            throw(exception);
        }
    }
    async updateSingleRowByFilter(filter, data) {
        try {
            const updateResponse = await this.model.findOneAndUpdate(filter, {$set: data}, {new: true})
            return updateResponse;
        } catch (exception) {
            throw exception
        }
    }
    async deleteSingleRowByFilter(filter) {
        try {
            const delResponse = await this.model.findOneAndDelete(filter)
            return delResponse;
        } catch (exception) {
            throw exception
        }
    }
}

module.exports = BaseService;