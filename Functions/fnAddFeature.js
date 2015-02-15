//fuction to add a feture to userbilling history table entry also included
db.system.js.save({_id: "fnAddFeature",
      value: function (data) {
    var resultmsg;
    var companyId = ObjectId(data.companyId);
    var loggedusercrmid = ObjectId(data.loggedusercrmid);
    var userid = db.clnCompany.findOne({_id:companyId}, {_id:0, fkuserLoginId:1});
    data.feature.featureId = ObjectId(data.feature.featureId);

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
    
db.clnUserBilling.update({fkuserLoginId:userid.fkuserLoginId},{$set:{updatedDate:Date(), urmId:loggedusercrmid},$push:{'plan.features':data.feature}});

resultmsg='feature added'

var result={'result':resultmsg}
    return result;
}}); 