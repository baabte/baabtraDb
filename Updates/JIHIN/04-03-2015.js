db.system.js.save({_id:"fnLoadMenus",value:function(e){return db.clnUserMenuMapping.findOne({fkUserRoleMappingId:e},{menuStructure:1})}});

db.system.js.save({_id:"fnGetGlobals",value:function(l){return""!=l?db.clnGlobals.findOne({_id:l},{"values.approved":1}):db.clnGlobals.find({},{"values.approved":1}).toArray()}});
