

db.system.js.save({_id: "fnLoadCustomFormTemplates",
	value: function() {
    return db.clnCustomFormFields.find({activeFlag:1}).toArray();
}});
