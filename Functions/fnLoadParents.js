/*
Created By Lijin
Creted On: 1-7-2015
Purpose : For listing and finding parent users
*/

db.system.js.save({_id:'fnLoadParents',
'value':function (data) {
    return db.clnUserRoleMapping.find({fkRoleId:5,"profile.fkCompanyId":ObjectId(data.companyId)});
}});