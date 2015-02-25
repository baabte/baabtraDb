db.system.js.save({_id: "fnUserNameValid",
                  value: function (data) {
var  userId = db.clnUserLogin.findOne({userName:data.eMail},{_id:1});
     
    if (userId == null) {
        result = {userCheck:0,result:'no user'};
    }
    else if ((userId != null)&&(data.fetch=='')) {
        result = {userCheck:1,result:'exsisting user profile not fetched'};
    }
    else if ((userId != null)&&(data.fetch=='data')) {
        var UserDetails = db.clnUserDetails.findOne({     fkUserLoginId:userId._id},{_id:1,profile:1});
    if (UserDetails!=null){
    	if (UserDetails.profile != undefined) {
        UserDetails.profile.eMail = data.eMail;
        result = {userCheck:1,UserDetails:UserDetails,result:'exsisting user profile fetched'};
    	}
    	else if (UserDetails.profile == undefined) {
        UserDetails.profile.eMail = data.eMail;
        result = {userCheck:1,UserDetails:UserDetails,result:'exsisting user profle not created'};
    	}
    }       
    }
    
    return result;
}});