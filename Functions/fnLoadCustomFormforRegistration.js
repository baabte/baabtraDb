//fnLoadCustomFormforRegistration
db.system.js.save({
    "_id" : "fnLoadCustomFormforRegistration",
    "value" : function(companyId, formName) {

    try{
        
    var customFormsMain = db.clnCustomFormsMain.findOne({formName:formName,activeFlag:1});
    var companyCustomForm = db.clnCompanyCustomForm.findOne({formId:customFormsMain._id,companyId:ObjectId(companyId),activeFlag:1});
   
    
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



