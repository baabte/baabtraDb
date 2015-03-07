db.system.js.save({_id: "fnGetCurrentMenusById",
                  value: function (id,type) {
    if(type=="role")
    {
        data = db.clnRoleMenuMapping.find({fkRoleId:id,activeFlag:1}).toArray();
    }
    else if(type=="all")
    {
        data = db.clnMenuMaster.find({activeFlag:1}).toArray();
    }
    else
    {
        data = db.clnUserMenuMapping.find({fkUserRoleMappingId:id,activeFlag:1}).toArray();
    }

    return data;
}});
