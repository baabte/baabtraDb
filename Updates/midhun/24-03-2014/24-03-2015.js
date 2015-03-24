db.system.js.save({_id: "fnretrieveExistingGlobalConf",
		value:function (data) {
    var returnData = {};
    returnData.CompanyRoles= db.clnRoleMaster.find({companyId:ObjectId(data), activeFlag:1}).toArray();
    returnData.existingConf = db.clnGlobalSettings.findOne({companyId:data, activeFlag:1});
    return returnData;
}
});


db.system.js.save({_id: "fnUpdateUserProfileDatas",
		value:function (data) {
    if (data.userDetailsObjId) {
        response = db.clnUserDetails.update({_id:ObjectId(data.userDetailsObjId)}, {$set:{profile:data.profile}});
        if (data.profile.Preferedlanguage) {
            db.clnActiveUserData.update({userLoginId:data.userLoginId}, {$set:{Preferedlanguage:data.profile.Preferedlanguage}});
        }
    } else {
        var newCollection = {};
        newCollection.crmId = ObjectId(data.userLoginId);
        newCollection.urmId = ObjectId(data.userLoginId);
        newCollection.fkUserLoginId = ObjectId(data.userLoginId);
        newCollection.createdDate = Date();
        newCollection.updatedDate = Date();
        newCollection.activeFlag = 1;
        newCollection.profile = data.profile;
        db.clnUserDetails.save(newCollection);
        if (data.profile.Preferedlanguage) {
            db.clnActiveUserData.update({userLoginId:data.userLoginId}, {$set:{Preferedlanguage:data.profile.Preferedlanguage}});
        }
        return "success";
    }
}
});


