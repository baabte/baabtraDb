db.system.js.save({_id: "fnLoadProfile",
		value:function (userloginId) {
     profileData=db.clnUserDetails.findOne({fkUserLoginId:ObjectId(userloginId)},{"profile":1});
    return profileData;
           
}});