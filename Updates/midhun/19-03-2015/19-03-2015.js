db.system.js.save({_id: "fnaddGeneratedCode",
		value:function(data) {
    	var checkExistance=db.clnGlobalSettings.findOne({"companyId":data.companyId});
       if(checkExistance){
     	var companyId=data.companyId;
    	 	delete data.companyId;
    	 	return db.clnGlobalSettings.update({"companyId":companyId},{$set:{"codes":data}});
    }

}});


db.system.js.save({_id: "fnretrieveExistingGlobalConf",
		value:function(data) {
    	var returnData={};
    	returnData.CompanyRoles= db.clnRoleMaster.findOne({companyId:ObjectId(data), activeFlag:1});
    	returnData.existingConf= db.clnGlobalSettings.findOne({companyId:data, activeFlag:1});
    	return returnData;
}});