/*
Created by : Jihin
Created On : 17/03/2015
Purpose : Load Users Under Role
*/

db.system.js.save({_id: "fnLoadUsersUnderRole",
        value: function(roleId, companyId) {
    if(typeof roleId == "string"){
        roleId = ObjectId(roleId);
    }
    var usersList = db.clnUserRoleMapping.find({fkRoleId:roleId,profile:{$elemMatch:{fkCompanyId:ObjectId(companyId)}},activeFlag:1},{fkUserLoginId:1}).toArray();
    
    var userDetails = [];
    usersList.forEach(function(user){
        userData = {};
        userData["roleMappingId"] = ObjectId(user._id.valueOf());
        var profile = db.clnUserDetails.find({fkUserLoginId:ObjectId(user.fkUserLoginId.valueOf())},{profile:1,_id:0}).toArray();
        userData["profile"] = profile[0].profile;
        userDetails.push(userData);
    });
    return userDetails;
}});
