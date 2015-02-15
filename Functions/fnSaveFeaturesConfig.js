//fnSaveFeaturesConfig funtion to save user feture config values
db.system.js.save({_id: "fnSaveFeaturesConfig",
      value: function (data) { 
   var  companyId = ObjectId(data.companyId);
   var loggedusercrmid = ObjectId(data.loggedusercrmid);
   data.fConfig.featureId = ObjectId(data.fConfig.featureId);
   var userid = db.clnCompany.findOne({_id:companyId}, {_id:0, fkuserLoginId:1});
   var UserFeatureId = db.clnUserFeatureConfig.findOne({fkuserLoginId:userid.fkuserLoginId});
    if(UserFeatureId!=null){
   var test= db.clnUserFeatureConfig.findOne({fkuserLoginId:userid.fkuserLoginId});
  
db.clnUserFeatureConfig.update({fkuserLoginId:userid.fkuserLoginId},{$pull:{featureConfigs:{featureId:data.fConfig.featureId}}});

db.clnUserFeatureConfig.update({fkuserLoginId:userid.fkuserLoginId}, {$set:{updatedDate:Date(), urmId:loggedusercrmid},$push:{featureConfigs:data.fConfig}});  
    resultmsg='feature updated or added';
 }
 else{
     var userFeature={fkuserLoginId:userid.fkuserLoginId,updatedDate:Date(),createdDate:Date(), crmId:loggedusercrmid, urmId:loggedusercrmid,featureConfigs:[data.fConfig]};
    db.clnUserFeatureConfig.insert(userFeature);
     resultmsg='feature added first time';
     }
   var result={'result':resultmsg,'test':test}
   
   
   return result;

}});