db.system.js.save({_id: "fnGetCode",
      value:function (data) {
   
    var codeData = {};
    var itemList = db.clnGlobalSettings.findOne({companyId:data.companyId}, {itemCodes:1, _id:0});   
    if (itemList) {
        itemList = itemList.itemCodes;
        for (var i = 0; i < itemList.length; i++) {
            for (j = 0; j < itemList[i].items.length; j++) {
                if (itemList[i].items[j] == data.item) {
                    if (itemList[i].currentRange) {
                        codeData.prefix = itemList[i].prefix;
                        codeData.IncPattern = itemList[i].IncPattern;
                        codeData.range = ++itemList[i].currentRange;
                        db.clnGlobalSettings.update({companyId:data.companyId}, {$set:{itemCodes:itemList}});
                    } else {
                        if (itemList[i].startRange) {
                            codeData.prefix = itemList[i].prefix;
                            codeData.IncPattern = itemList[i].IncPattern;
                            codeData.range = itemList[i].startRange;
                            itemList[i].currentRange = itemList[i].startRange;
                            db.clnGlobalSettings.update({companyId:data.companyId}, {$set:{itemCodes:itemList}});
                        } else {
                            codeData.prefix = itemList[i].prefix;
                            codeData.IncPattern = itemList[i].IncPattern;
                            codeData.range = 1;
                            itemList[i].startRange = 1;
                            itemList[i].currentRange = 1;
                            db.clnGlobalSettings.update({companyId:data.companyId}, {$set:{itemCodes:itemList}});
                        }
                    }
                }
            }
        }
        return codeData.prefix.concat(fngetIncrementalCode(codeData.range, codeData.IncPattern));
    } else {
        return "no Patterns found";
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
    var language = db.clnUserDetails.findOne({fkUserLoginId:ObjectId(user.userLoginId)}, {profile:1, activeFlag:1});
    if (language) {
        user.Preferedlanguage = language.profile.Preferedlanguage;
    }
    user.roleMappingId = login_data[0].lastLoggedRoleMapping;
    if (role_id[0].profile) {
        var arraylen = role_id[0].profile.length;
        if (arraylen != undefined) {
            fkCompanyId = role_id[0].profile[0].fkCompanyId;
            delete role_id[0].profile;
        } else {
            fkCompanyId = null;
            delete role_id[0].profile;
        }
    } else {
        fkCompanyId = null;
    }
    user.roleMappingObj = role_id[0];
    if (fkCompanyId) {
        user.roleMappingObj.fkCompanyId = fkCompanyId;
        companyData = db.clnCompany.findOne({_id:fkCompanyId}, {companyName:1, companyLogo:1, _id:0});
        if (companyData) {
            user.roleMappingObj.companyInfo = companyData;
        }
    }
    ip_addresses.push(ip_address);
    user.ip_address = ip_addresses;
    user.loginDate = new Date;
    if (role_id[0].fkRoleId == 2) {
        var userinfo = db.clnCompany.findOne({_id:role_id[0].fkCompanyId}, {companyName:1, eMail:1, appSettings:1});
        var globalConfi = db.clnGlobalSettings.findOne({companyId:role_id[0].fkCompanyId.valueOf(), activeFlag:1});
        if (globalConfi) {
            if (globalConfi.supervisorRoles) {
                user.roleMappingObj.supervisorRoles = globalConfi.supervisorRoles;
            }
            if (globalConfi.evalRoles) {
                user.roleMappingObj.evalRoles = globalConfi.evalRoles;
            }
            if(globalConfi.modernView)
            {
               user.modernView = globalConfi.modernView; 
            }
            if(globalConfi.menuColor)
            {
               user.menuColor = globalConfi.menuColor; 
            }
            if(globalConfi.subTitleAndBackColor)
            {
               user.subTitleAndBackColor = globalConfi.subTitleAndBackColor; 
            }
        }
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
        ActiveUserDataId = db.clnActiveUserData.findOne({userLoginId:user.userLoginId}, {_id:1});
        ActiveUserDataId = ActiveUserDataId._id.valueOf();
    }
    var userinfos = ActiveUserDataId.concat(user.userLoginId);
    return fun_load_log_user_data(userinfos);
}

  });






db.system.js.save({_id: "fnchangeSubTitleandBack",
      value:function (data) {
    var menuVar = db.clnGlobalSettings.findOne({companyId:data.companyId}, {subTitleAndBackColor:1});
    if (menuVar) {
        db.clnGlobalSettings.update({companyId:data.companyId}, {$set:{subTitleAndBackColor:data.subTitleAndBackColor}});
        db.clnActiveUserData.update({userLoginId:data.userLoginId}, {$set:{subTitleAndBackColor:data.subTitleAndBackColor}});
        return "success";
    } else {
        db.clnGlobalSettings.insert({companyId:data.companyId, activeFlag:1, createdDate:Date(), updatedDate:Date(), crmId:data.userLoginId, urmId:data.userLoginId, subTitleAndBackColor:data.subTitleAndBackColor});
        db.clnActiveUserData.update({userLoginId:data.userLoginId}, {$set:{subTitleAndBackColor:data.subTitleAndBackColor}});
        return "success";
    }
}
  });

