/*
Created by : Jihin
Created On : 11/03/2015
Purpose : View Feedback Requests
*/
db.system.js.save({_id: "fnViewFeedbackRequests",
        value:function(rmId, companyId) {
    var FeedbackRequests = db.clnFeedbacks.find({targetList:{$in:[ObjectId(rmId)]},companyId:ObjectId(companyId)},{title:1,description:1}).toArray();
    return FeedbackRequests;
}});
