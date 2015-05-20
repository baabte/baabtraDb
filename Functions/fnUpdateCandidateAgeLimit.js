db.system.js.save({_id:'fnUpdateCandidateAgeLimit',value:function(companyId,limitRange){
   db.clnGlobalSettings.update({companyId:companyId},{$set:{candidateAgeLimit:limitRange}});
   return db.clnGlobalSettings.findOne({companyId:companyId});
}});