//fnLoadProfile

/*
created by :midhun
*/
/*
Modified by :arun
On:28/05/2015
purpose:profile pic from user details if present there
*/

db.system.js.save({_id: "fnLoadProfile",
      value: function (userloginId) {
    profileData={};
    profileData=db.clnUserDetails.findOne({fkUserLoginId:ObjectId(userloginId)},{"profile":1,"passwordChanges":1});
    userEmail=db.clnUserLogin.findOne({_id:ObjectId(userloginId)},{userName:1,_id:0});
    userImage=db.clnUserRoleMapping.findOne({"fkUserLoginId":ObjectId(userloginId)},{"avatar":1,_id:0});
    if(userEmail)
    {
        profileData.email=userEmail.userName;
        }
    if(userImage)
    {
        profileData.ProfilePic=userImage.avatar;
     }
     if(profileData.profile.userPic){
        profileData.ProfilePic=profileData.profile.userPic;
     }
    return profileData;
}});