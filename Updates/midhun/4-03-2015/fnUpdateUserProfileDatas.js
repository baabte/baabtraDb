db.system.js.save({_id: "fnUpdateUserProfileDatas",
		value: function (data) {
		var dataAndField={};
		dataAndField["profile".data.field]=data.newData;
		response=db.clnUserDetails.update({_id:ObjectId(data.userDetailsObjId)},{$set:dataAndField});
            
}});
