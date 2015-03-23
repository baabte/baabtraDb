
db.system.js.save({_id: "fnaddEvaluator",
		value:function(data) {
    db.clnGlobalSettings.insert(data);
}});


//not needed to add production