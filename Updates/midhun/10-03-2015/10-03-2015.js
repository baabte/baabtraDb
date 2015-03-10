db.clnUserDetails.ensureIndex({fkUserLoginId:1});
db.clnActiveUserData.ensureIndex({userLoginId:1});


db.system.js.save({_id: "fnLogin",
		value:function (data) {
    ReturnData = {};
    if (data.from_where == "direct") {
        user_valid_or_not = db.clnUserLogin.find({userName:data.loginCredential.userName, password:data.loginCredential.password}).limit(1).count();
        if (user_valid_or_not == 0) {
            ReturnData.result = "false";
            return ReturnData;
        } else {
            return GetAuthUserData(data.loginCredential, data.ip, data.from_where);
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
                db.clnUserDetails.update({fkUserLoginId:id[0]}, {$set:{'profile.facebookProfileLink':data.socialData.facebookProfileLink, 'profile.mediaName':data.socialData.mediaName, 'profile.email':data.socialData.email}});
                if (data.socialData.profileImg) {
                    db.clnUserRoleMapping.update({fkUserLoginId:id[0]}, {$set:{avatar:data.socialData.profileImg}});
                }
                return GetAuthUserData(data.loginCredential.facebookId,data.ip, data.from_where);
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
            return GetAuthUserData(data.loginCredential.facebookId, data.ip,data.from_where);
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
                return GetAuthUserData(data.loginCredential.linkedInId, data.ip,data.from_where);
            }
        } else {
            return GetAuthUserData(data.loginCredential.linkedInId, data.ip,data.from_where);
        }
    }
}

	});





db.system.js.save({_id: "GetAuthUserData",
		value:function (data,ip_address,from_where) {
    
            ReturnData = {};
            ip_addresses=[];
            if(from_where=="direct"){
                login_data = db.clnUserLogin.find(data, {_id:1, roleMappings:1, lastLoggedRoleMapping:1}).limit(1).toArray();
            }
            else if(from_where=="facebook"){
                login_data = db.clnUserLogin.find({facebookId:data}, {_id:1, roleMappings:1, lastLoggedRoleMapping:1}).limit(1).toArray();
            }else if(from_where=="linkedIn"){
                login_data = db.clnUserLogin.find({linkedInId:data}, {_id:1, roleMappings:1, lastLoggedRoleMapping:1}).limit(1).toArray();
            }
           
            role_id = db.clnUserRoleMapping.find({_id:login_data[0].lastLoggedRoleMapping}).toArray();
            ReturnData.ActiveUserDataId = new ObjectId;
            var user = {};
            user._id = ReturnData.ActiveUserDataId;
            user.userLoginId = login_data[0]._id.valueOf();;
            user.roleMappingId = login_data[0].lastLoggedRoleMapping;
            if(role_id[0].profile)
            {
                delete role_id[0].profile;
            }
            user.roleMappingObj = role_id[0];
            ip_addresses.push(ip_address);
            user.ip_address=ip_addresses;
            user.loginDate=new Date();
            ReturnData.result = "true";
            ReturnData.userLoginId = login_data[0]._id.valueOf();
            ReturnData.ActiveUserData = user;
             if(role_id[0].fkRoleId==2){
                var userinfo= db.clnCompany.findOne({"_id" : role_id[0].fkCompanyId},{"companyName":1,"eMail":1, "appSettings":1}); 
                ReturnData.ActiveUserData.username =userinfo.companyName;
                        ReturnData.ActiveUserData.eMail = data.userName;
                        ReturnData.ActiveUserData.appSettings = userinfo.appSettings;
                        user.username=userinfo.companyName;
                        user.eMail=userinfo.eMail;
            }
                    else if(role_id[0].fkRoleId==3){
                        var userdata=db.clnUserDetails.findOne({"fkUserLoginId": ObjectId(ReturnData.userLoginId)},{"profile":1,"activeFlag" : 1});
                        var username=userdata.profile.firstName.concat(" "+userdata.profile.lastName);
                       
                        if(from_where=="direct"){
                             var email=data.userName;
                            }
                        else{
                             var email=userdata.profile.email;
                            }
                        ReturnData.ActiveUserData.username=username;
                        ReturnData.ActiveUserData.eMail =email;
                         user.username=username;
                        user.eMail=email;
                       
            }
            else if(role_id[0].fkRoleId==4){
                var userinfo=db.clnReseller.findOne({fkuserLoginId:login_data[0]._id},{resellerName:1,email:1});
                ReturnData.ActiveUserData.username =userinfo.resellerName;
                        ReturnData.ActiveUserData.eMail =userinfo.email;
                        user.username=userinfo.resellerName;
                        user.eMail=userinfo.email;

            }
                    else{
                        LogUserData = db.clnUserLogin.find({_id:ObjectId(ReturnData.userLoginId)}).limit(1).toArray();
                        ReturnData.ActiveUserData.username = LogUserData[0].userName;
                        user.username=LogUserData[0].userName;
                    }
            userExistsOrNot=db.clnActiveUserData.find({"userLoginId":user.userLoginId}).limit(1).count();
            if(userExistsOrNot==0){
                db.clnActiveUserData.insert(user);
                        db.clnLoginHistory.insert(user);
            }
            else{
                db.clnActiveUserData.update({"userLoginId":user.userLoginId},{ $push: { "ip_address": ip_address } });
                db.clnLoginHistory.insert(user);
                ActiveUserDataId=db.clnActiveUserData.find({"userLoginId":user.userLoginId},{ "_id":1 }).limit(1).toArray();
                ReturnData.ActiveUserDataId=ActiveUserDataId[0]._id;
                ReturnData.ActiveUserData._id=ActiveUserDataId[0]._id;


            }
            
            return ReturnData;
}		
	});



db.system.js.save({_id: "fun_load_log_user_data",
		value:function (objId) {
    
           var userData={};
		    var activeObjId=objId.substr(0, objId.length-24); 
		    var activeUsrId=objId.substr(24);
		    //userLoginData=db.clnActiveUserData.find({"_id" : ObjectId(activeObjId),userLoginId:activeUsrId}).limit(1).toArray();
            userLoginData=db.clnActiveUserData.find({"_id" : ObjectId(activeObjId),"userLoginId":{"$in":[activeUsrId,ObjectId(activeUsrId)]}}).limit(1).toArray();
		    userLoginData[0].userLoginId=userLoginData[0].userLoginId.valueOf();
		    userData.ActiveUserDataId=userLoginData[0]._id;
		    userData.ActiveUserData=userLoginData[0];
		    userData.userLoginId=userLoginData[0].userLoginId;
		    userData.ActiveUserData.username=userLoginData[0].username;
		    userData.result="true";
		    return userData;
		}
	});
