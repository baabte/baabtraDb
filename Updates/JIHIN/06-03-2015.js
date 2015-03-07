db.system.js.save({_id:"fnUpdateMenu",value:function(e){return db.clnMenuMaster.save(e),db.clnMenuMaster.find({activeFlag:1}).toArray()}});

db.system.js.save({_id:"fnGetCurrentMenusById",value:function(e,a){return data="role"==a?db.clnRoleMenuMapping.find({fkRoleId:e,activeFlag:1}).toArray():"all"==a?db.clnMenuMaster.find({activeFlag:1}).toArray():db.clnUserMenuMapping.find({fkUserRoleMappingId:e,activeFlag:1}).toArray()}});
