db.system.js.save({_id: "fnLoadUserNotificationFull",
value:function(data) {
    var result = {};
    if(data.lastId!=''){
      data.filter._id = {$lt:ObjectId(data.lastId)};
    }
    
    result.notifications = db.clnNotification.find(data.filter).sort({_id:-1}).limit(15).toArray();
  
    result.unreadCount = db.clnNotification.find({fkLoginId:data.filter.fkLoginId,read:0}).count();
    
    return result;
    
}
})