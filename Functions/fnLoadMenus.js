
db.system.js.save({_id: "fnLoadMenus",
	value: function(rm_id) {
   return db.clnUserMenuMapping.findOne({fkUserRoleMappingId:rm_id},{menuStructure:1});
}});
