db.system.js.save({_id: "fnUpdateUserProfileDatas",
		value: function (data) {
		response = db.clnUserDetails.update({_id:ObjectId(data.userDetailsObjId)}, {$set:{profile:data.profile}});
            
}});
