db.system.js.save({_id: "fnLoadUserNotification",
		   value:function(fkLoginId) {
                       
                   var result = {};
                       result.notifications = db.clnNotification.find({fkLoginId:fkLoginId}).sort({_id:-1}).limit(5).toArray();
                       result.unreadCount = db.clnNotification.find({fkLoginId:fkLoginId,read:0}).count();
                   return result;
	}
   });