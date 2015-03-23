
db.system.js.save({_id: "fnaddEvaluator",
		value:function(data) {
			var GlobalconF = {};
		    GlobalconF.companyId = data.companyId;
		    GlobalconF.activeFlag = 1;
		    GlobalconF.createdDate = Date();
		    GlobalconF.updatedDate = Date();
		    GlobalconF.crmId = data.userLoginId;
		    GlobalconF.urmId = data.userLoginId;
		    GlobalconF.evalRoles=data.evalRoles;
		    CheckGlobalConfExists = db.clnGlobalSettings.findOne({companyId:data.companyId});
		    if (CheckGlobalConfExists) {
		        db.clnGlobalSettings.update({companyId:data.companyId}, {$pushAll:{evalRoles:data.evalRoles}});
		    } else {
		        db.clnGlobalSettings.insert(GlobalconF);
		    }
}});

db.system.js.save({_id: "fnaddGeneratedCode",
		value:function(data) {
    	 var checkExistance=db.clnGlobalSettings.findOne({"companyId":data.companyId});
       if(checkExistance){
     	var companyId=data.companyId;
    	 	delete data.companyId;
    	 	return db.clnGlobalSettings.update({"companyId":companyId},{$push:{"itemCodes":data}});
    }
}});

db.system.js.save({_id: "fnretrieveExistingGlobalConf",
		value:function(data) {
    	var returnData={};
    	returnData.CompanyRoles= db.clnRoleMaster.findOne({companyId:ObjectId(data), activeFlag:1});
    	returnData.existingConf= db.clnGlobalSettings.findOne({companyId:data, activeFlag:1});
    	return returnData;
}});


db.system.js.save({_id: "fnremoveExistingEvaluator",
		value:function (data) {
    return db.clnGlobalSettings.update({companyId:data.companyId}, {$pull:{evalRoles:data.evaluator}});
}});



db.system.js.save({_id: "fnChangePassword",
		value:function(changePwdObj) {
    var response={};
    pwdExists=db.clnUserLogin.findOne
    ({_id:ObjectId(changePwdObj.userLoginId),password:changePwdObj.currentPassword,activeFlag:1});
    if(pwdExists){
            db.clnUserLogin.update({_id:ObjectId(changePwdObj.userLoginId)},{$set:{password:changePwdObj.newPassword}});
            var changedate=ISODate();
             db.clnUserDetails.update({fkUserLoginId:ObjectId(changePwdObj.userLoginId)},{$set:{"passwordChanges":changedate}});
            response.changedate=changedate;
            response.response="success";
            return response;
        }
        else{
            response.response="fail";
            return response;
            }
    
}});




