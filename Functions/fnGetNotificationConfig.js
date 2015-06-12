db.system.js.save({
_id:'fnGetNotificationConfig',
"value":function (companyId,configType) {
  var config = db.clnNotificationConfigs.findOne({companyId:companyId,configType:configType});
   return config;
}
});