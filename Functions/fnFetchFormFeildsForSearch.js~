db.system.js.save({
    "_id" : "fnFetchFormFeildsForSearch",
    "value" :function (formName, companyId) {
var formId = db.clnCustomFormsMain.findOne({formName:formName})._id;
var formFields = db.clnCompanyCustomForm.findOne({formId:formId,companyId:ObjectId(companyId)});
var fields = [];
if(formFields != null){
    formFields = formFields.formSchema.fields;
for(var field in formFields){
    fields.push({text:formFields[field].DisplayName,model:formFields[field].mandatoryAttributes[0].text});
}
}
return fields;
}});
