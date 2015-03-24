
/*
Created by : Jihin
Date : 18-3-2015
purpose : For Load Mentees For Approve
*/

db.system.js.save({_id:'fnLoadMenteesForApprove',
value:function(companyId, statusType) {
    /*var userLogins = db.clnUserRoleMapping.distinct('fkUserLoginId',{profile:{$elemMatch:{fkCompanyId:ObjectId(companyId)}},fkRoleId:3})
    var userDetails = db.clnUserDetails.find({status:statusType,fkUserLoginId:{$in:userLogins}},{fkUserLoginId:1, profile:1, status:1,crmId:1})
    var userObject = {};
    var index = 0;
    userDetails.forEach(function(user){
        var userInfo = db.clnUserLogin.findOne({_id:user.fkUserLoginId},{userName:1}); 
        user.email = userInfo.userName;
        userObject[index] = {};
        userObject[index] =  user;
        index = index + 1;
        });*/
    
	return db.clnTrainingRequest.find({companyId:ObjectId(companyId)},{orderDetails:1,orderFormId:1,crmId:1}).toArray();
}});
