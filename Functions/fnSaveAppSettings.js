db.system.js.save({_id: "fnSaveAppSettings",
                   value: function(companyId, appSettings, rmId) {
   		   db.clnCompany.update({_id:companyId},{$set:{appSettings:appSettings}},{upsert:true});
                   db.clnActiveUserData.update({roleMappingId:rmId},{$set:{appSettings:appSettings}},{upsert:true})
                   return "Success";
                 }});
