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
