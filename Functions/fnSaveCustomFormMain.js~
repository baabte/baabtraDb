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
