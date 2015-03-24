db.system.js.save({_id: "fnretrieveExistingGlobalConf",
		value:function (data) {
    var returnData = {};
    returnData.CompanyRoles= db.clnRoleMaster.find({companyId:ObjectId(data), activeFlag:1}).toArray();
    returnData.existingConf = db.clnGlobalSettings.findOne({companyId:data, activeFlag:1});
    return returnData;
}
});