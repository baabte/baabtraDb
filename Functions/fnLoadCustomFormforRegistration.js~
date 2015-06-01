//fnLoadCustomFormforRegistration
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
