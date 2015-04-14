

db.system.js.save({_id: "fnsaveAttendanceAlertSettings",
      value:function (data) {
    var attendanceAlertConfig = db.clnGlobalSettings.findOne({companyId:data.companyId}, {attendanceAlertConfig:1});
    if (attendanceAlertConfig) {
        db.clnGlobalSettings.update({companyId:data.companyId}, {$set:{attendanceAlertConfig:data.Settings}});
        db.clnActiveUserData.update({userLoginId:data.userLoginId}, {$set:{attendanceAlertConfig:data.Settings}});
        return "success";
    } else {
      
        db.clnGlobalSettings.insert({companyId:data.companyId, activeFlag:1, createdDate:Date(), updatedDate:Date(), crmId:data.userLoginId, urmId:data.userLoginId, attendanceAlertConfig:data.Settings});
        db.clnActiveUserData.update({userLoginId:data.userLoginId}, {$set:{attendanceAlertConfig:data.Settings}});
        return "success";
    }
}
  });
