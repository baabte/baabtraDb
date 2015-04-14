db.system.js.save({_id: "fnsetMenuType",
      value: function (data) { 

		function (data) {
    var menuVar = db.clnGlobalSettings.findOne({companyId:data.companyId}, {modernView:1});
    if (menuVar) {
        db.clnGlobalSettings.update({companyId:data.companyId}, {$set:{modernView:data.modernView}});
        db.clnActiveUserData.update({userLoginId:data.userLoginId}, {$set:{modernView:data.modernView}});
        return "success";
    } else {
        db.clnGlobalSettings.insert({companyId:data.companyId, activeFlag:1, createdDate:Date(), updatedDate:Date(), crmId:data.userLoginId, urmId:data.userLoginId, modernView:data.modernView});
        db.clnActiveUserData.update({userLoginId:data.userLoginId}, {$set:{modernView:data.modernView}});
        return "success";
    }
	}
}});