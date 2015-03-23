
db.system.js.save({_id: "fnupdateExistingPrefix",
        value:
        function (data) {
    var GlobalSettings=db.clnGlobalSettings.findOne({"companyId":data.companyId,activeFlag:1})
for(var index=0;index<GlobalSettings.itemCodes.length;index++)
{
    for(var index1=0;index1<GlobalSettings.itemCodes[index].items.length;index1++)
    {
        if(GlobalSettings.itemCodes[index].items[index1]==data.item){
                GlobalSettings.itemCodes[index][data.field]=data.data
                break;
            }
    }
}
    db.clnGlobalSettings.save(GlobalSettings);
    return "success";
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
    //if (role_id[0].profile) {
    //    delete role_id[0].profile;
    //}
    
    if(role_id[0].profile){
        var arraylen=role_id[0].profile.length;
        if(arraylen!=undefined){
            fkCompanyId=role_id[0].profile[0].fkCompanyId;
            delete role_id[0].profile;
         }
         else{
             fkCompanyId=null;
             }
        
     }
     else{
         fkCompanyId=null;
     }
    user.roleMappingObj = role_id[0];
     if(fkCompanyId){
          user.roleMappingObj.fkCompanyId = fkCompanyId;
          companyData=db.clnCompany.findOne({ "_id" : fkCompanyId},{companyName:1,companyLogo:1,_id:0});  
          if(companyData){
              user.roleMappingObj.companyInfo = companyData;
              }
          
         }
   
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
        ActiveUserDataId = db.clnActiveUserData.findOne({userLoginId:user.userLoginId}, {_id:1});
        ActiveUserDataId = ActiveUserDataId._id.valueOf();
    }
    var userinfos = ActiveUserDataId.concat(user.userLoginId);
    return fun_load_log_user_data(userinfos);
}

    });



db.system.js.save({_id: "fnremoveItemFormAgroup",
        value:function(data) {
            var GlobalSettings=db.clnGlobalSettings.findOne({"companyId":data.companyId,activeFlag:1})
            for(var index=0;index<GlobalSettings.itemCodes.length;index++)
            {
                for(var index1=0;index1<GlobalSettings.itemCodes[index].items.length;index1++)
                {
                    if(GlobalSettings.itemCodes[index].items[index1]==data.item){
                            GlobalSettings.itemCodes[index].items.splice(index1,1);
                            arryLen=GlobalSettings.itemCodes[index].items.length;
                                        if(arryLen<1){
                                            GlobalSettings.itemCodes.splice(index,1);
                                            }
                            break;
                        }
                }
            }
                db.clnGlobalSettings.save(GlobalSettings);
                return "success";
}});





db.system.js.save({_id: "fnsetSupervisors",
        value:function(data) {
            var GlobalconF = {};
            GlobalconF.companyId = data.companyId;
            GlobalconF.activeFlag = 1;
            GlobalconF.createdDate = Date();
            GlobalconF.updatedDate = Date();
            GlobalconF.crmId = data.userLoginId;
            GlobalconF.urmId = data.userLoginId;
            GlobalconF.supervisorRoles=data.supervisorRoles;
            CheckGlobalConfExists = db.clnGlobalSettings.findOne({companyId:data.companyId});
            if (CheckGlobalConfExists) {
                db.clnGlobalSettings.update({companyId:data.companyId}, {$pushAll:{supervisorRoles:data.supervisorRoles}});
            } else {
                db.clnGlobalSettings.insert(GlobalconF);
            }
}});




db.system.js.save({_id: "fnremoveExistingSupervisors",
        value:function (data) {
        return db.clnGlobalSettings.update({companyId:data.companyId}, {$pull:{supervisorRoles:data.supervisor}});
}});




//need to edit


db.system.js.save({_id: "fnaddGeneratedCode",
        value:function(data) {
         var checkExistance=db.clnGlobalSettings.findOne({"companyId":data.companyId});
       if(checkExistance){
        var companyId=data.companyId;
            delete data.companyId;
            delete data.userLoginId;
            return db.clnGlobalSettings.update({"companyId":companyId},{$push:{"itemCodes":data}});
        }
        else{
            var GlobalconF={};
            GlobalconF.companyId = data.companyId;
            GlobalconF.activeFlag = 1;
            GlobalconF.createdDate = Date();
            GlobalconF.updatedDate = Date();
            GlobalconF.crmId = data.userLoginId;
            GlobalconF.urmId = data.userLoginId;
            delete data.companyId;
            delete data.userLoginId;
            GlobalconF.itemCodes=[data];
            db.clnGlobalSettings.insert(GlobalconF);
        }
}});