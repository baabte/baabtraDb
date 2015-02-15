//fnEditBilling function to edit user billing in user billing collection 
db.system.js.save({_id: "fnEditBilling",
      value: 
function (data) {
    companyId = ObjectId(data.companyId);
    featureId = ObjectId(data.featureId);
    loggedusercrmid = ObjectId(data.loggedusercrmid);
    userid = db.clnCompany.findOne({_id:companyId}, {_id:0, fkuserLoginId:1});
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
    db.clnUserBilling.update({fkuserLoginId:userid.fkuserLoginId, 'plan.features.featureId':featureId}, {$set:{'plan.features.$.billing':data.billing, updatedDate:Date(), urmId:loggedusercrmid}});
}});