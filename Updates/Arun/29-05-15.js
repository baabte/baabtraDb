

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
    var language = db.clnUserDetails.findOne({fkUserLoginId:ObjectId(user.userLoginId)},{profile:1, activeFlag:1});
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
    //added by arun to replace the user pic if present in user details
    if(language.profile.userPic){
    user.roleMappingObj.avatar=language.profile.userPic;
    }

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
            if (globalConfi.modernView) {
                user.modernView = globalConfi.modernView;
            }
            if (globalConfi.menuColor) {
                user.menuColor = globalConfi.menuColor;
            }
            if (globalConfi.subTitleAndBackColor) {
                user.subTitleAndBackColor = globalConfi.subTitleAndBackColor;
            }
        }
        user.appSettings = userinfo.appSettings;
        user.username = userinfo.companyName;
        user.eMail = data.userName;
    } else if (role_id[0].fkRoleId == 3) {
        var userdata = db.clnUserDetails.findOne({fkUserLoginId:ObjectId(user.userLoginId)}, {profile:1, activeFlag:1});

        var username = userdata.profile.firstName.concat(" " +userdata.profile.lastName===undefined?userdata.profile.lastName:" ");
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
}});



db.system.js.save({_id: "fnLoadProfile",
      value: function (userloginId) {
    profileData={};
    profileData=db.clnUserDetails.findOne({fkUserLoginId:ObjectId(userloginId)},{"profile":1,"passwordChanges":1});
    userEmail=db.clnUserLogin.findOne({_id:ObjectId(userloginId)},{userName:1,_id:0});
    userImage=db.clnUserRoleMapping.findOne({"fkUserLoginId":ObjectId(userloginId)},{"avatar":1,_id:0});
    if(userEmail)
    {
        profileData.email=userEmail.userName;
        }
    if(userImage)
    {
        profileData.ProfilePic=userImage.avatar;
     }
     if(profileData.profile.userPic){
        profileData.ProfilePic=profileData.profile.userPic;
     }
    return profileData;
}});



db.system.js.save({_id:'fnLoadMenteesForApprove',
value:function(companyId, statusType, pageNumber, nPerPage, searchKey,orderFormType) {
    var data = {};
    if(!orderFormType){
        var orderFormType='';
    }
     if(orderFormType==''){
    data.type = "text";
    data.orderFroms = [];//db.clnTrainingRequest.find({$text: { $search: searchKey }, companyId:ObjectId(companyId), "orderDetails.userInfo.status":{$in:statusType}}).skip(
    //pageNumber > 0 ? ((pageNumber-1)*nPerPage) : 0).sort({customCompanyCode:-1}).limit(nPerPage).toArray();
    if(!data.orderFroms.length){
    data.type = "regex";
        data.orderFroms = db.clnTrainingRequest.find({
            $or:[
            {"status" :{$regex:new RegExp(searchKey,'i')}},
            {"requesteeDetails.eMail" :{$regex:new RegExp(searchKey,'i')}},
            {"customCompanyCode" :{$regex:new RegExp(searchKey,'i')}},
            {"requesteeDetails.type" :{$regex:new RegExp(searchKey,'i')}},
            {'orderDetails.userInfo.userCode':{$regex:new RegExp(searchKey, "i")}}
            ], companyId:ObjectId(companyId), "orderDetails.userInfo.status":{$in:statusType}}).skip(
    pageNumber > 0 ? ((pageNumber-1)*nPerPage) : 0).sort({customCompanyCode:-1}).limit(nPerPage).toArray();
    }

    }else{

    data.type = "text";
    data.orderFroms = [];//db.clnTrainingRequest.find({$text: { $search: searchKey }, companyId:ObjectId(companyId), "orderDetails.userInfo.status":{$in:statusType}}).skip(
    //pageNumber > 0 ? ((pageNumber-1)*nPerPage) : 0).sort({customCompanyCode:-1}).limit(nPerPage).toArray();
    if(!data.orderFroms.length){
    data.type = "regex";
        data.orderFroms = db.clnTrainingRequest.find({
            $or:[
            {"status" :{$regex:new RegExp(searchKey,'i')}},
            {"requesteeDetails.eMail" :{$regex:new RegExp(searchKey,'i')}},
            {"customCompanyCode" :{$regex:new RegExp(searchKey,'i')}},
            {"requesteeDetails.type" :{$regex:new RegExp(searchKey,'i')}},
            {'orderDetails.userInfo.userCode':{$regex:new RegExp(searchKey, "i")}}
            ], companyId:ObjectId(companyId),'requesteeDetails.type':orderFormType,"orderDetails.userInfo.status":{$in:statusType}}).skip(
    pageNumber > 0 ? ((pageNumber-1)*nPerPage) : 0).sort({customCompanyCode:-1}).limit(nPerPage).toArray();
    }
    
    }
    return data;
}});




db.system.js.save({
_id:"fnLoadMenteesForPayment",
"value":function(companyId,pageNumber, nPerPage,searchKey,orderFormType){
var data = {};

    if(orderFormType==''){
    data.type = "regex";
    data.orderFroms = db.clnTrainingRequest.find({
        $or:[
                {status:{$regex:new RegExp(searchKey, "i")}},
                {'requesteeDetails.eMail':{$regex:new RegExp(searchKey, "i")}},
                {customCompanyCode:{$regex:new RegExp(searchKey, "i")}},
                {'requesteeDetails.type':{$regex:new RegExp(searchKey, "i")}},
                {'orderDetails.userInfo.userCode':{$regex:new RegExp(searchKey, "i")}}
            ],
            companyId:ObjectId(companyId),
            //'orderDetails.userInfo.status':{$in:statusType}
            'orderDetails.userInfo.statusHistory.statusChangedTo':{$nin:["paid","Paid"]},
            }).skip(pageNumber > 0 ? (pageNumber - 1) * nPerPage : 0).sort({customCompanyCode:-1}).limit(nPerPage).toArray();

    }else{
    data.type = "regex";
    data.orderFroms = db.clnTrainingRequest.find({
        $or:[
                {status:{$regex:new RegExp(searchKey, "i")}},
                {'requesteeDetails.eMail':{$regex:new RegExp(searchKey, "i")}},
                {customCompanyCode:{$regex:new RegExp(searchKey, "i")}},
                {'requesteeDetails.type':{$regex:new RegExp(searchKey, "i")}},
                {'orderDetails.userInfo.userCode':{$regex:new RegExp(searchKey, "i")}}
            ],
            companyId:ObjectId(companyId),
            'requesteeDetails.type':orderFormType,
            //'orderDetails.userInfo.status':{$in:statusType}
            'orderDetails.userInfo.statusHistory.statusChangedTo':{$nin:["paid","Paid"]},
            }).skip(pageNumber > 0 ? (pageNumber - 1) * nPerPage : 0).sort({customCompanyCode:-1}).limit(nPerPage).toArray();


    }
    return data;
}});