db.system.js.save({
    "_id" : "fnDownloadUserDetails",
    "value" : function(data) {
        data = JSON.parse(data);
        data["UserLogin"]._id = ObjectId(data["UserLogin"]._id.$oid);
        data["UserLogin"].crmId = ObjectId(data["UserLogin"].crmId.$oid);
        data["UserLogin"].urmId = ObjectId(data["UserLogin"].urmId.$oid);
        data["UserLogin"].companyId = ObjectId(data["UserLogin"].companyId.$oid);
        data["UserLogin"].lastLoggedRoleMapping = ObjectId(data["UserLogin"].lastLoggedRoleMapping.$oid);
        data["UserLogin"].roleMappings[0] = ObjectId(data["UserLogin"].roleMappings[0].$oid);
        db.clnUserLogin.save(data["UserLogin"]);
        
        /*db.clnUserRoleMapping.save(data["UserRoleMapping"]);
        db.clnUserDetails.save(data["UserDetails"]);
        db.clnUserMenuMapping.save(data["UserMenuMapping"]);
        db.clnUserCourseMapping.save(data["UserCourseMapping"]);*/
        return data["UserLogin"];
}});
