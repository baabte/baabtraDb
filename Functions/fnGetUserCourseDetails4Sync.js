
db.system.js.save({
    "_id" : "fnGetUserCourseDetails4Sync",
    "value" : function(userLoginIds) {
        var result = {};
        for(var userLoginId in userLoginIds){
            userLoginIds[userLoginId] = ObjectId(userLoginIds[userLoginId]);
            result["UserLogin"] = db.clnUserLogin.findOne({_id:userLoginIds[userLoginId]});
            result["UserRoleMapping"] = db.clnUserRoleMapping.findOne({fkUserLoginId:userLoginIds[userLoginId]});
            result["UserDetails"] = db.clnUserDetails.findOne({fkUserLoginId:userLoginIds[userLoginId]});
            result["UserMenuMapping"] = db.clnUserMenuMapping.findOne({fkUserRoleMappingId:result["UserRoleMapping"]._id});
            result["UserCourseMapping"] = db.clnUserCourseMapping.find({fkUserLoginId:userLoginIds[userLoginId]}).toArray();
            }
        return result;
}});
