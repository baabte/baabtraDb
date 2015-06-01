db.system.js.save({
    "_id" : "fnLoadCustomFormMain",
    "value" : function () {
    return db.clnCustomFormsMain.find({activeFlag:1}).toArray();
}};
