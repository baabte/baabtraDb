//fnSaveFeaturesConfig funtion to save user feture config values
db.system.js.save({_id: "fnLogin",
      value: function (data) { 
   
         
ReturnData = {};
    if (data.from_where == "direct") {
        user_valid_or_not = db.clnUserLogin.find({userName:data.loginCredential.userName,password:data.loginCredential.password}).limit(1).count();
        if (user_valid_or_not == 0) {
            ReturnData.result = "false";
            return ReturnData;
        } else {
            return GetAuthUserData(data.loginCredential, data.ip);
        }
    } else if (data.from_where == "facebook") {
        user_id_exists_or_not = db.clnUserLogin.find({facebookId:data.loginCredential.facebookId}).limit(1).count();
        if (user_id_exists_or_not == 0) {
            id = db.clnUserLogin.find({userName:data.socialData.email}, {_id:1}).map(function (item) {return item._id;});
            if (id[0]) {
                db.clnUserLogin.update({_id:id[0]}, {$set:{facebookId:data.socialData.facebookId}});
                delete data.socialData.firstName;
                delete data.socialData.lastName;
                delete data.socialData.facebookId;
                db.clnUserDetails.update({"fkUserLoginId":id[0]},{$set:{ "profile.facebookProfileLink":data.socialData.facebookProfileLink,"profile.mediaName":data.socialData.mediaName,"profile.email":data.socialData.email}});
               if(data.socialData.profileImg){
                      db.clnUserRoleMapping.update({"fkUserLoginId":id[0]}, { $set:{avatar:data.socialData.profileImg}});
                   }
                return GetAuthUserDataThroughFacebook(data.loginCredential.facebookId, data.ip);
            } else {
                UserLoginId = ObjectId();
                roleMappingId = ObjectId();
                db.clnUserRoleMapping.save({_id:roleMappingId, fkRoleId:3, fkUserLoginId:UserLoginId, fkCompanyId:"", fkEmployeeId:"", fkConsumerId:"", groups:[], createdDate:Date(), updatedDate:Date(), crmId:"", urmId:"", activeFlag:1, avatar:data.socialData.profileImg});
                db.clnUserLogin.save({_id:UserLoginId, userName:data.socialData.email, roleMappings:[roleMappingId], lastLoggedRoleMapping:roleMappingId, createdDate:Date(), updatedDate:Date(), crmId:"", urmId:"", activeFlag:1, facebookId:data.socialData.facebookId});
                menuStructure = db.clnRoleMenuMapping.findOne({fkRoleId:3}, {menuStructure:1, _id:0});
                db.clnUserMenuMapping.save({fkUserRoleMappingId:roleMappingId, menuStructure:menuStructure.menuStructure, createdDate:Date(), updatedDate:Date(), crmId:"", urmId:"", activeFlag:1});
                delete data.socialData.profileImg;
                delete data.socialData.facebookId;
                db.clnUserDetails.save({"fkUserLoginId":UserLoginId, "profile":data.socialData});
                return GetAuthUserDataThroughFacebook(data.loginCredential.facebookId,data.ip);
            }
        } else {
            
                return GetAuthUserDataThroughFacebook(data.loginCredential.facebookId,data.ip);
        }
    } else if (data.from_where == "linkedIn") {
        user_id_exists_or_not = db.clnUserLogin.find({linkedInId:data.loginCredential.linkedInId}).limit(1).count();
        if (user_id_exists_or_not == 0) {
            id = db.clnUserLogin.find({userName:data.socialData.email}, {_id:1}).map(function (item) {return item._id;});
            if (id[0]) {
                db.clnUserLogin.update({_id:id[0]}, {$set:{linkedInId:data.socialData.linkedInId}});
                delete data.socialData.firstName;
                delete data.socialData.lastName;
                delete data.socialData.facebookId;
                 db.clnUserDetails.update({"fkUserLoginId":id[0]},{$set:{ "profile.linkedInProfileUrl":data.socialData.linkedInProfileUrl,"profile.email":data.socialData.email,"profile.mediaName":data.socialData.mediaName}});
                 if(data.socialData.profileImg){
                      db.clnUserRoleMapping.update({"fkUserLoginId":id[0]}, { $set:{avatar:data.socialData.profileImg}});
                 }
               
                return GetAuthUserDataThroughlinkedIn(data.loginCredential.linkedInId, data.ip);
            } else {
                UserLoginId = ObjectId();
                roleMappingId = ObjectId();
                db.clnUserRoleMapping.save({_id:roleMappingId, fkRoleId:3, fkUserLoginId:UserLoginId, fkCompanyId:"", fkEmployeeId:"", fkConsumerId:"", groups:[], createdDate:Date(), updatedDate:Date(), crmId:"", urmId:"", activeFlag:1, avatar:data.socialData.profileImg});
                db.clnUserLogin.save({_id:UserLoginId, userName:data.socialData.email, roleMappings:[roleMappingId], lastLoggedRoleMapping:roleMappingId, createdDate:Date(), updatedDate:Date(), crmId:"", urmId:"", activeFlag:1, linkedInId:data.socialData.linkedInId});
                menuStructure = db.clnRoleMenuMapping.findOne({fkRoleId:3}, {menuStructure:1, _id:0});
                db.clnUserMenuMapping.save({fkUserRoleMappingId:roleMappingId, menuStructure:menuStructure.menuStructure, createdDate:Date(), updatedDate:Date(), crmId:"", urmId:"", activeFlag:1});
                delete data.socialData.profileImg;
                delete data.socialData.linkedInId;
                db.clnUserDetails.save({"fkUserLoginId":UserLoginId, "profile":data.socialData});
                return GetAuthUserDataThroughlinkedIn(data.loginCredential.linkedInId, data.ip);
            }
        } else {
            return GetAuthUserDataThroughlinkedIn(data.loginCredential.linkedInId,data.ip);
        }
    }


}}); 