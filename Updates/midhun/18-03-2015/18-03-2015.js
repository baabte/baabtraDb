db.system.js.save({_id: "fnaddGeneratedCode",
		value:function(data) {
    	var checkExistance=db.clnGlobalSettings.findOne({"companyId":data.companyId});
    	if(checkExistance){
    		var companyId=data.companyId;
    		delete data.companyId;
    		db.clnGlobalSettings.update({"companyId":companyId},{$set:{codes:data}});
    	}
}});