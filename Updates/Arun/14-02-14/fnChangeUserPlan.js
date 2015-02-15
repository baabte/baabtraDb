//fnChangeUserPlan funtion to change user plan history table entry also included 
db.system.js.save({_id: "fnChangeUserPlan",
      value: function (data) {
    var companyId = ObjectId(data.companyId);
    var loggedusercrmid = ObjectId(data.loggedusercrmid);
    var set = {};
    var resultmsg;
    var userid = db.clnCompany.findOne({_id:companyId}, {_id:0, fkuserLoginId:1});
    data.plan.planId = ObjectId(data.plan.planId);
    var flen = data.plan.features.length;
    i = 0;
    while (i < flen) {
        data.plan.features[i].featureId = ObjectId(data.plan.features[i].featureId);
        i++;
    }
    billuser = db.clnUserBilling.findOne({fkuserLoginId:userid.fkuserLoginId}, {_id:1});
    if (billuser == null) {
        set.plan = data.plan;
        set.updatedDate = Date();
        set.createdDate = Date();
        set.crmId = loggedusercrmid;
        set.urmId = loggedusercrmid;
        set.fkUserLoginId = userid.fkuserLoginId;
        set.activeFlag = 1;
        db.clnUserBilling.insert(set);
        resultmsg = "user plan first set";
    } 
    else {
        set.plan = data.plan;
        set.createdDate = Date();
        set.updatedDate = Date();
        set.urmId = loggedusercrmid;
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
        db.clnUserBilling.update({fkuserLoginId:userid.fkuserLoginId},{$set:set});
        resultmsg = "user plan updated";
    }
    var result = {result:resultmsg};
    return result;

      }});