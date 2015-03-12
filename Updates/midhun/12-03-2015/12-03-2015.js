
db.system.js.save({_id: "fnChangePassword",
		value:function(changePwdObj) {
    var response={};
    pwdExists=db.clnUserLogin.findOne
    ({_id:ObjectId(changePwdObj.userLoginId),password:changePwdObj.currentPassword,activeFlag:1});
    if(pwdExists){
            db.clnUserLogin.update({_id:ObjectId(changePwdObj.userLoginId)},{$set:{password:changePwdObj.newPassword}});
            var changedate=ISODate();
             db.clnUserDetails.update({fkUserLoginId:ObjectId(changePwdObj.userLoginId)},{$set:{"profile.passwordChanges":changedate}});
            response.changedate=changedate;
            response.response="success";
            return response;
        }
        else{
            response.response="fail";
            return response;
            }
    
}});



db.system.js.save({_id: "fnUpdateUserProfileDatas",
		value:function(data) {
    	 response = db.clnUserDetails.update({_id:ObjectId(data.userDetailsObjId)}, {$set:{profile:data.profile}});
    
}});
