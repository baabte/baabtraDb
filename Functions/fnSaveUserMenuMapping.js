
/*
Created by : Jihin
Created On : 11/01/2015
Updated On : 17/03
Purpose : For Save menus users under roles
*/

db.system.js.save({_id: "fnSaveUserMenuMapping",
        value: function (rm_id, role_id, menu) {
    if(typeof role_id == "string"){
        role_id = ObjectId(role_id);
    }
    db.clnUserRoleMapping.find({fkRoleId:role_id}, {_id:1}).forEach(function (myDoc) {
        db.clnUserMenuMapping.update({fkUserRoleMappingId:myDoc._id}, {$set:{'menuStructure.0.regionMenuStructure':menu, updatedDate:Date(), urmId:rm_id}});});
    return rm_id;
}});
