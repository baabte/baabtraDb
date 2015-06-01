db.system.js.save({
    "_id" : "fnSaveCustomFormMain",
    "value" : function (customForm) {
    var saveType = "Added";
    if (customForm._id) {
        customForm._id = ObjectId(customForm._id);
        saveType = "Updated";
    }
    customForm.crmId = ObjectId(customForm.crmId);
    customForm.urmId = ObjectId(customForm.urmId);
    db.clnCustomFormsMain.save(customForm);
    return {result:saveType};
}});

db.system.js.save({
    "_id" : "fnLoadCustomFormMain",
    "value" : function () {
    return db.clnCustomFormsMain.find({activeFlag:1}).toArray();
}};

db.system.js.save({
    "_id" : "fnSaveCompanyCustomForm",
    "value" : function (customForm) {
	var saveType = "Added";
    if(customForm._id){
      customForm._id = ObjectId(customForm._id);
	saveType = "Updated"; 
    }
	customForm.companyId = ObjectId(customForm.companyId);
    customForm.formId = ObjectId(customForm.formId);
    customForm.crmId = ObjectId(customForm.crmId);
    customForm.urmId = ObjectId(customForm.urmId);
    db.clnCompanyCustomForm.save(customForm);
    return {result:saveType};
}});

db.system.js.save({
    "_id" : "fnLoadCompanyCustomForm",
    "value" : function (companyId, formId) {
    return db.clnCompanyCustomForm.find({companyId:ObjectId(companyId),formId:ObjectId(formId),activeFlag:1}).toArray();
}});


db.system.js.save({
    "_id" : "fnLoadCustomFormforRegistration",
    "value" : function(formId) {

    try{
    var companyCustomForm = db.clnCompanyCustomForm.findOne({_id:ObjectId(formId),activeFlag:1});
    var customFormsMain = db.clnCustomFormsMain.findOne({_id:companyCustomForm.formId,activeFlag:1});
    
    var form = {};
    form[customFormsMain.formSchema.formName] = customFormsMain.formSchema;
    form[companyCustomForm.formSchema.formName] = companyCustomForm.formSchema;

    if(Object.keySet(form).length > 1){
        return {companyId:companyCustomForm.companyId, form:form};    
    }
}
catch(e){
    return {};
}
}});
