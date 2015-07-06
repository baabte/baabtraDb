
db.system.js.save({
    "_id" : "fncheckUserIdExistenceView",
    "value" : function (userId) {
	var user = db.clnUserLogin.findOne({userId:userId,activeFlag:1});
	var exists = false;
	if(user){
		exists = true;
	}
	return exists;
}});
