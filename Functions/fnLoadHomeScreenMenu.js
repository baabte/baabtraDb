db.system.js.save({_id:'fnLoadHomeScreenMenu',value:function (data) {
	return db.clnHomeScreenConfig.findOne({_id:data.companyType});
}});