
/*
Created by : Jihin
Created On : 15/03/2015
Purpose : Insert Notification Details
*/

db.system.js.save({_id: "fnInsertNotificationDetails",
        value: function(userId, typeId, type, message, rmId) {
    var notificationInfo = {};
    notificationInfo.userRoleMappingId = "";
    notificationInfo.notification = [{type:type, typeId:typeId, date:ISODate(), message:message}];
    notificationInfo.createdDate = ISODate();
    notificationInfo.updatedDate = ISODate();
    notificationInfo.crmId = rmId;
    notificationInfo.urmId = rmId;
    notificationInfo.activeFlag = 1;
    
    var alreadyExists = "";
    if(userId.length != null){
        for(var userCount = 0;userCount < userId.length; userCount++){
        notificationInfo.userRoleMappingId = userId[userCount];
        alreadyExists = db.clnNotification.findOne({userRoleMappingId:notificationInfo.userRoleMappingId});
        if(alreadyExists == null){
            db.clnNotification.insert(notificationInfo);
        }
        else{
            db.clnNotification.update({userRoleMappingId:notificationInfo.userRoleMappingId},{$push:{notification:notificationInfo.notification[0]}});
        }
      }
    }
    return notificationInfo;
}});
