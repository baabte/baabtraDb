/*
Created by : Jihin
Created On : 11/03/2015
Updated On : 12/03/2015
Purpose : View Feedback Requests
*/
db.system.js.save({_id: "fnLoadUserCardDetail",
        value:function(rmId) {
    var userInfo = {};
    var userRoleInfo = db.clnUserRoleMapping.findOne({_id:ObjectId(rmId)},{fkRoleId:1,fkUserLoginId:1,_id:0});
    userInfo.roleMappingId = ObjectId(rmId);
    userInfo.roleId = userRoleInfo.fkRoleId;
    userInfo.loginId = userRoleInfo.fkUserLoginId;
    var roleName = db.clnRoleMaster.findOne({_id:userRoleInfo.fkRoleId},{roleName:1});
    userInfo.userName = db.clnUserLogin.findOne({_id:userRoleInfo.fkUserLoginId},{userName:1,_id:0}).userName;
    userInfo.roleName = roleName.roleName;

    switch(userInfo.roleId){
        case 2:
            var companyInfo = db.clnCompany.findOne({fkuserLoginId:userInfo.loginId},{companyName:1});
            userInfo.Name = companyInfo.companyName;
        break;
        default:
            var userInfoDetails = db.clnUserDetails.findOne({fkUserLoginId:userInfo.loginId},{profile:1});
            userInfo.Name = userInfoDetails.profile.firstName + ' ' + (userInfoDetails.profile.lastName?userInfoDetails.profile.lastName:"");
        }

    return userInfo

}});
