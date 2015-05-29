//fun_load_log_user_data
/*
created by midhun
*/


db.system.js.save({_id: "fun_load_log_user_data",
        value:function (objId) {
    var userData = {};
    var activeObjId = objId.substr(0, objId.length - 24);
    var activeUsrId = objId.substr(24);
    userLoginData = db.clnActiveUserData.findOne({_id:ObjectId(activeObjId), userLoginId:{$in:[activeUsrId, ObjectId(activeUsrId)]}});
    userData.ActiveUserDataId = userLoginData._id;
    userData.ActiveUserData = userLoginData;
    userData.userLoginId = activeUsrId;
    userData.ActiveUserData.username = userLoginData.username;
    userData.result = "true";
    return userData;
}});