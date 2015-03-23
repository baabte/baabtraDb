/*
Created by : Jihin
Created On : 11/01/2015
Updated On : 19/03
Purpose : For Save menus roles
*/

db.system.js.save({_id: "fnSaveRoleMenuMapping",
        value: function (rm_id, id, menu) {
    if(typeof id == "string"){
        id = ObjectId(id);
    }
    if (db.clnRoleMenuMapping.findOne({fkRoleId:id}) != null) {
        db.clnRoleMenuMapping.update({fkRoleId:id}, {$set:{'menuStructure.0.regionMenuStructure':menu, updatedDate:ISODate(), urmId:ObjectId(rm_id)}});
        data = "Update";
    } else {
        db.clnRoleMenuMapping.insert({fkRoleId:id, menuStructure:[{fkmenuRegionId:1, regionMenuStructure:menu}], createdDate:ISODate(), updatedDate:ISODate(), crmId:ObjectId(rm_id), urmId:ObjectId(rm_id), activeFlag:1});
        data = "Insert";
    }
    return data;
}});
