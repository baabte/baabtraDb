/*
Created by : Jihin
Created On : 01/01/2015
Purpose : For Get Current Menus By role mapping id
*/

db.system.js.save({_id: "fnGetCurrentMenusById",

	value:function (id,type) {
    
    if(typeof id == "string"){
        id = ObjectId(id);
     }
    
    
    if(type=="role")
    {
        data = db.clnRoleMenuMapping.findOne({fkRoleId:id,activeFlag:1});
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
