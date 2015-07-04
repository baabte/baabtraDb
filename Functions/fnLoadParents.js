/*
Created By Lijin
Creted On: 1-7-2015
Purpose : For listing and finding parent users
*/

db.system.js.save({_id:'fnLoadParents',
'value':function (data) {
    var loginIds =  db.clnUserRoleMapping.distinct('fkUserLoginId',{fkRoleId:5,"profile.fkCompanyId":ObjectId(data.companyId)});
    var datas = db.clnUserDetails.find({fkUserLoginId:{$in:loginIds},$or:[{"profile.firstName":{$regex:new RegExp(data.searchKey,'i')}},{"profile.lastName":{$regex:new RegExp(data.searchKey,'i')}},{"userName":{$regex:new RegExp(data.searchKey,'i')}}]}).toArray();
    return datas;
}});