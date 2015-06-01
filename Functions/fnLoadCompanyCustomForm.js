db.system.js.save({
    "_id" : "fnLoadCompanyCustomForm",
    "value" : function (companyId, formId) {
    return db.clnCompanyCustomForm.find({companyId:ObjectId(companyId),formId:ObjectId(formId),activeFlag:1}).toArray();
}});
