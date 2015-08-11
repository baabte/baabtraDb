db.system.js.save({_id: "fnLoadUserNotification",
		   value:function(fkLoginId) {
                       
                   var result = {};
                       result.notifications = db.clnNotification.find({fkLoginId:fkLoginId}).sort({_id:-1}).limit(5).toArray();
                       result.unreadCount = db.clnNotification.find({fkLoginId:fkLoginId,read:0}).count();
                   return result;
	}
   });


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
});


db.system.js.save({
_id:'fnNewNotification',
value:function(data){
    data._id = new ObjectId();
    data.crmId = ObjectId(data.crmId);
    data.createdDate = new Date();
    data.read = 0;
    
    db.clnNotification.save(data);
    return data;
}
});