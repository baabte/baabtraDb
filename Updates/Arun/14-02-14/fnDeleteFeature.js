//fnDeleteFeature funtion to delete the function from userbilling
db.system.js.save({_id: "fnDeleteFeature",
      value: function (data) {
      	companyId = ObjectId(data.companyId);
    loggedusercrmid = ObjectId(data.loggedusercrmid);
    userid = db.clnCompany.findOne({_id:companyId}, {_id:0, fkuserLoginId:1});
    data.featureId = ObjectId(data.featureId);
    
    var historyobj=db.clnUserBilling.findOne({fkuserLoginId:userid.fkuserLoginId},{updatedDate:0,crmId:0,urmId:0,activeFlag:0});
        historyobj.startDate = historyobj.createdDate;
        delete historyobj.createdDate;
        historyobj.endDate=Date();
        historyobj.crmId = loggedusercrmid;
        historyobj.urmId = loggedusercrmid;
        historyobj.activeFlag = 1;
        historyobj.fkuserBillingId=historyobj._id;
        delete historyobj._id;
       
        db.clnUserBillingHistory.insert(historyobj);  
    
    db.clnUserBilling.update({fkuserLoginId:userid.fkuserLoginId},{$set:{updatedDate:Date(), urmId:loggedusercrmid} ,$pull:{'plan.features':{featureId:data.featureId}}});
    db.clnUserFeatureConfig.update({fkuserLoginId:userid.fkuserLoginId}, {$set:{updatedDate:Date(), urmId:loggedusercrmid},$pull:{featureConfigs:{featureId:data.featureId}}});

      }});