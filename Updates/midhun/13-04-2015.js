

db.system.js.save({_id: "fnsaveAttendanceAlertSettings",
      value:function (data) {
    var attendanceAlertConfig = db.clnGlobalSettings.findOne({companyId:data.companyId}, {attendanceAlertConfig:1});
    if (attendanceAlertConfig) {
        var companyId = data.companyId;
        var userLoginId = data.userLoginId;
        delete data.userLoginId;
        delete data.companyId;
        db.clnGlobalSettings.update({companyId:companyId}, {$set:{attendanceAlertConfig:data}});
        db.clnActiveUserData.update({userLoginId:userLoginId}, {$set:{attendanceAlertConfig:data}});
        return "success";
    } else {
        var companyId = data.companyId;
        var userLoginId = data.userLoginId;
        delete data.userLoginId;
        delete data.companyId;
        db.clnGlobalSettings.insert({companyId:companyId, activeFlag:1, createdDate:Date(), updatedDate:Date(), crmId:userLoginId, urmId:userLoginId, attendanceAlertConfig:data});
        db.clnActiveUserData.update({userLoginId:userLoginId}, {$set:{attendanceAlertConfig:data}});
        return "success";
    }
}
  });
