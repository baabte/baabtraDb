db.system.js.save({_id: "fnArchiveUserNotification",
		   value:function(userRoleMappingId, typeId, rmId) {
    var userNotification = db.clnNotification.findOne({userRoleMappingId:ObjectId(userRoleMappingId)},{notification:{$elemMatch:{typeId:ObjectId(typeId)}},_id:0});
    userNotification.notification[0].archivedDate = ISODate();
    userNotification.createdDate = ISODate();
    userNotification.updatedDate = ISODate();
    userNotification.crmId = rmId;
    userNotification.urmId = rmId;
    userNotification.activeFlag = 1;
    userNotification.userRoleMappingId = ObjectId(userRoleMappingId);
    
    var alreadyExists = "";
        
        alreadyExists = db.clnArchiveNotification.findOne({userRoleMappingId:ObjectId(userRoleMappingId)});
        if(alreadyExists == null){
            db.clnNotification.insert(userNotification);
        }
        else{
            db.clnArchiveNotification.update({userRoleMappingId:ObjectId(userRoleMappingId)},{$push:{notification:userNotifiction.notification[0]}});
        }
    var result = db.clnNotification.update({userRoleMappingId:ObjectId(userRoleMappingId)},{$pull:{notification:{typeId:ObjectId(typeId)}}},{multi:true});
    return fnLoadUserNotification(userRoleMappingId);
}
   });
