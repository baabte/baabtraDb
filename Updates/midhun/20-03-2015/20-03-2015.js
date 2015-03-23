db.system.js.save({_id: "fnaddGeneratedCode",
		value:function(data) {
    	var checkExistance=db.clnGlobalSettings.findOne({"companyId":data.companyId});
       if(checkExistance){
     	var companyId=data.companyId;
    	 	delete data.companyId;
    	 	return db.clnGlobalSettings.update({"companyId":companyId},{$push:{"itemCodes":data}});
    }
}});

