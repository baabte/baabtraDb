//fnuserbaabtraComProfileData funtion to retrieve needed for profile
db.system.js.save({_id: "fnuserbaabtraComProfileData",
      value: function (data) { 

        var returnData={};
        var userLoginData=db.clnUserLogin.findOne({_id:ObjectId(data),"activeFlag" : 1});
        var avatarObj=db.clnUserRoleMapping.findOne({_id:userLoginData.lastLoggedRoleMapping,"activeFlag" : 1},{"avatar":1,_id:0})
        returnData.avatar=avatarObj.avatar;
        return returnData;

}}); 