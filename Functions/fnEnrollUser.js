//fnEnrollUser
//updated by : Arun
// purpose : bug fix.
db.system.js.save({
    "_id" : "fnEnrollUser",
    "value" : function (data) {
    var _id = db.clnUserDetails.findOne({fkUserLoginId:ObjectId(data.mandatoryData.userLoginId)},{_id:1,profile:1});
    data.mandatoryData.orderFormId=_id.profile.orderFormId;
    data._id = _id._id.valueOf();
    fnRegisterUser(data);
    return data;
}});