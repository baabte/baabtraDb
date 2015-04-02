
db.system.js.save({_id: "fnFetchRoleList",
        value: function (FetchRoleObj) {
    var companyId = ObjectId(FetchRoleObj.companyId);
    var rolelist = db.clnRoleMaster.find({companyId:companyId, activeFlag:1}, {_id:1, roleName:1}).toArray();
    var topRoleList = db.clnRoleMaster.find({_id:{$in:FetchRoleObj.topRoleFetch}}, {_id:1, roleName:1}).toArray();
    rolelist = topRoleList.concat(rolelist);
    for (var index in rolelist) {
        rolelist[index].Name = rolelist[index].roleName;
        delete rolelist[index].roleName;
        if (rolelist[index]._id.valueOf() != undefined) {
            rolelist[index].roleId = rolelist[index]._id.valueOf();
            delete rolelist[index]._id;
        } else {
            rolelist[index].roleId = rolelist[index]._id;
            delete rolelist[index]._id;
        }
    }
    return rolelist;
}});