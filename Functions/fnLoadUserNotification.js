db.system.js.save({_id: "fnLoadUserNotification",
		   value:function(rmId) {
                   return db.clnNotification.findOne({userRoleMappingId:ObjectId(rmId)},{notification:1});
	}
   });
