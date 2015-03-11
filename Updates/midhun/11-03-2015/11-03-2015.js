db.clnUserLogin.ensureIndex({activeFlag:1});


db.system.js.save({_id: "fnLogin",
		value:function (data) {
    ReturnData = {};
    if (data.from_where == "direct") {
        user_valid_or_not = db.clnUserLogin.find({userName:data.loginCredential.userName, password:data.loginCredential.password,activeFlag:1}).limit(1).count();
        if (user_valid_or_not == 0) {
            ReturnData.result = "false";
            return ReturnData;
        } else {
            return GetAuthUserData(data.loginCredential, data.ip, data.from_where);
        }
    } else if (data.from_where == "facebook") {
        user_id_exists_or_not = db.clnUserLogin.find({facebookId:data.loginCredential.facebookId,activeFlag:1}).limit(1).count();
        if (user_id_exists_or_not == 0) {
            id = db.clnUserLogin.find({userName:data.socialData.email,activeFlag:1}, {_id:1}).map(function (item) {return item._id;});
            if (id[0]) {
                db.clnUserLogin.update({_id:id[0]}, {$set:{facebookId:data.socialData.facebookId}});
                delete data.socialData.firstName;
                delete data.socialData.lastName;
                delete data.socialData.facebookId;
                db.clnUserDetails.update({fkUserLoginId:id[0]}, {$set:{'profile.facebookProfileLink':data.socialData.facebookProfileLink, 'profile.mediaName':data.socialData.mediaName, 'profile.email':data.socialData.email}});
                if (data.socialData.profileImg) {
                    db.clnUserRoleMapping.update({fkUserLoginId:id[0]}, {$set:{avatar:data.socialData.profileImg}});
                }
                return GetAuthUserData(data.loginCredential.facebookId, data.ip, data.from_where);
            } else {
                UserLoginId = ObjectId();
                roleMappingId = ObjectId();
                db.clnUserRoleMapping.save({_id:roleMappingId, fkRoleId:3, fkUserLoginId:UserLoginId, fkCompanyId:"", fkEmployeeId:"", fkConsumerId:"", groups:[], createdDate:Date(), updatedDate:Date(), crmId:"", urmId:"", activeFlag:1, avatar:data.socialData.profileImg});
                db.clnUserLogin.save({_id:UserLoginId, userName:data.socialData.email, roleMappings:[roleMappingId], lastLoggedRoleMapping:roleMappingId, createdDate:Date(), updatedDate:Date(), crmId:"", urmId:"", activeFlag:1, facebookId:data.socialData.facebookId});
                menuStructure = db.clnRoleMenuMapping.findOne({fkRoleId:3}, {menuStructure:1, _id:0});
                db.clnUserMenuMapping.save({fkUserRoleMappingId:roleMappingId, menuStructure:menuStructure.menuStructure, createdDate:Date(), updatedDate:Date(), crmId:"", urmId:"", activeFlag:1});
                delete data.socialData.profileImg;
                delete data.socialData.facebookId;
                db.clnUserDetails.save({fkUserLoginId:UserLoginId, profile:data.socialData});
                return GetAuthUserData(data.loginCredential.facebookId, data.ip, data.from_where);
            }
        } else {
            return GetAuthUserData(data.loginCredential.facebookId, data.ip, data.from_where);
        }
    } else if (data.from_where == "linkedIn") {
        user_id_exists_or_not = db.clnUserLogin.find({linkedInId:data.loginCredential.linkedInId,activeFlag:1}).limit(1).count();
        if (user_id_exists_or_not == 0) {
            id = db.clnUserLogin.find({userName:data.socialData.email,activeFlag:1}, {_id:1}).map(function (item) {return item._id;});
            if (id[0]) {
                db.clnUserLogin.update({_id:id[0]}, {$set:{linkedInId:data.socialData.linkedInId}});
                delete data.socialData.firstName;
                delete data.socialData.lastName;
                delete data.socialData.facebookId;
                db.clnUserDetails.update({fkUserLoginId:id[0]}, {$set:{'profile.linkedInProfileUrl':data.socialData.linkedInProfileUrl, 'profile.email':data.socialData.email, 'profile.mediaName':data.socialData.mediaName}});
                if (data.socialData.profileImg) {
                    db.clnUserRoleMapping.update({fkUserLoginId:id[0]}, {$set:{avatar:data.socialData.profileImg}});
                }
                return GetAuthUserData(data.loginCredential.linkedInId, data.ip, data.from_where);
            } else {
                UserLoginId = ObjectId();
                roleMappingId = ObjectId();
                db.clnUserRoleMapping.save({_id:roleMappingId, fkRoleId:3, fkUserLoginId:UserLoginId, fkCompanyId:"", fkEmployeeId:"", fkConsumerId:"", groups:[], createdDate:Date(), updatedDate:Date(), crmId:"", urmId:"", activeFlag:1, avatar:data.socialData.profileImg});
                db.clnUserLogin.save({_id:UserLoginId, userName:data.socialData.email, roleMappings:[roleMappingId], lastLoggedRoleMapping:roleMappingId, createdDate:Date(), updatedDate:Date(), crmId:"", urmId:"", activeFlag:1, linkedInId:data.socialData.linkedInId});
                menuStructure = db.clnRoleMenuMapping.findOne({fkRoleId:3}, {menuStructure:1, _id:0});
                db.clnUserMenuMapping.save({fkUserRoleMappingId:roleMappingId, menuStructure:menuStructure.menuStructure, createdDate:Date(), updatedDate:Date(), crmId:"", urmId:"", activeFlag:1});
                delete data.socialData.profileImg;
                delete data.socialData.linkedInId;
                db.clnUserDetails.save({fkUserLoginId:UserLoginId, profile:data.socialData});
                return GetAuthUserData(data.loginCredential.linkedInId, data.ip, data.from_where);
            }
        } else {
            return GetAuthUserData(data.loginCredential.linkedInId, data.ip, data.from_where);
        }
    }
}


});




db.system.js.save({_id: "GetAuthUserData",
		value:function (data, ip_address, from_where) {
    ip_addresses = [];
    if (from_where == "direct") {
        login_data = db.clnUserLogin.find(data, {_id:1, roleMappings:1, lastLoggedRoleMapping:1}).limit(1).toArray();
    } else if (from_where == "facebook") {
        login_data = db.clnUserLogin.find({facebookId:data}, {_id:1, roleMappings:1, lastLoggedRoleMapping:1}).limit(1).toArray();
    } else if (from_where == "linkedIn") {
        login_data = db.clnUserLogin.find({linkedInId:data}, {_id:1, roleMappings:1, lastLoggedRoleMapping:1}).limit(1).toArray();
    }
    role_id = db.clnUserRoleMapping.find({_id:login_data[0].lastLoggedRoleMapping}).toArray();
    ActiveUserDataId = new ObjectId;
    var user = {};
    user._id = ActiveUserDataId;
    ActiveUserDataId = ActiveUserDataId.valueOf();
    user.userLoginId = login_data[0]._id.valueOf();
    var language=db.clnUserDetails.findOne({fkUserLoginId:ObjectId(user.userLoginId)}, {profile:1, activeFlag:1});
    if(language){
        user.Preferedlanguage=language.profile.Preferedlanguage;
    }
    user.roleMappingId = login_data[0].lastLoggedRoleMapping;
    if (role_id[0].profile) {
        delete role_id[0].profile;
    }
    user.roleMappingObj = role_id[0];
    ip_addresses.push(ip_address);
    user.ip_address = ip_addresses;
    user.loginDate = new Date;
    if (role_id[0].fkRoleId == 2) {
        var userinfo = db.clnCompany.findOne({_id:role_id[0].fkCompanyId}, {companyName:1, eMail:1, appSettings:1});
        user.appSettings = userinfo.appSettings;
        user.username = userinfo.companyName;
        user.eMail = data.userName;
    } else if (role_id[0].fkRoleId == 3) {
        var userdata = db.clnUserDetails.findOne({fkUserLoginId:ObjectId(user.userLoginId)}, {profile:1, activeFlag:1});
        var username = userdata.profile.firstName.concat(" " + userdata.profile.lastName);
        var email = data.userName;
        user.username = username;
        user.eMail = email;
    } else if (role_id[0].fkRoleId == 4) {
        var userinfo = db.clnReseller.findOne({fkuserLoginId:login_data[0]._id}, {resellerName:1, email:1});
        user.username = userinfo.resellerName;
        user.eMail = userinfo.email;
    } else {
        LogUserData = db.clnUserLogin.find({_id:ObjectId(user.userLoginId)}).limit(1).toArray();
        user.username = LogUserData[0].userName;
        user.eMail = LogUserData[0].userName;
    }
    userExistsOrNot = db.clnActiveUserData.find({userLoginId:user.userLoginId}).limit(1).count();
    if (userExistsOrNot == 0) {
        db.clnActiveUserData.insert(user);
        db.clnLoginHistory.insert(user);
    } else {
        db.clnActiveUserData.update({userLoginId:user.userLoginId}, {$push:{ip_address:ip_address}});
        db.clnLoginHistory.insert(user);
        ActiveUserDataId=db.clnActiveUserData.findOne({"userLoginId":user.userLoginId},{ "_id":1 });
        ActiveUserDataId=ActiveUserDataId._id.valueOf();
    } 
    var userinfos = ActiveUserDataId.concat(user.userLoginId);
    return fun_load_log_user_data(userinfos);
}


	});





db.system.js.save({_id: "fun_load_log_user_data",
		value:function (objId)
{ 
             var userData={};
		    var activeObjId=objId.substr(0, objId.length-24); 
		    var activeUsrId=objId.substr(24);
            userLoginData=db.clnActiveUserData.findOne({"_id" : ObjectId(activeObjId),"userLoginId":{"$in":[activeUsrId,ObjectId(activeUsrId)]}});
		    userData.ActiveUserDataId=userLoginData._id;
		    userData.ActiveUserData=userLoginData;
		    userData.userLoginId=activeUsrId;
		    userData.ActiveUserData.username=userLoginData.username;
		    userData.result="true";
		    return userData;

}});
