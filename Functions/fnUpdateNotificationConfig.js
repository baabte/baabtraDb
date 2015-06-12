db.system.js.save({
_id:'fnUpdateNotificationConfig',
"value":function (companyId,rmId,config) {
	if(config._id){
            config._id = ObjectId(config._id);
            config.updatedDate = Date();
            config.urmId = rmId;
        }else
        {
            config.createdDate = Date();
            config.updatedDate = Date();
            config.crmId = rmId;
            config.urmId = rmId;
            config.companyId = companyId;
        }
        db.clnNotificationConfigs.save(config);
}
});