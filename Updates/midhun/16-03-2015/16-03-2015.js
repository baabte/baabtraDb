
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