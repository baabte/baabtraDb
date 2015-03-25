/*
Created by : Jihin
Created On : 11/03/2015
Updated On : 12/03/2015
Purpose : View Feedback Requests
*/
db.system.js.save({_id: "fnViewFeedbackRequests",
        value:function(rmId, companyId) {
    //,validUntil:{$gt:ISODate()}
    var feedbackRequests = {};
    var pendingFeedback = db.clnFeedbacks.find({targetList:{$in:[ObjectId(rmId)]},companyId:ObjectId(companyId),userResponse:{$not:{$elemMatch:{rmId:ObjectId(rmId)}}}},{title:1,description:1,createdDate:1}).sort( {createdDate: -1}).toArray();
    var submitedFeedback = db.clnFeedbacks.find({targetList:{$in:[ObjectId(rmId)]},companyId:ObjectId(companyId),userResponse:{$elemMatch:{rmId:ObjectId(rmId)}}},{title:1,description:1,createdDate:1}).sort( {createdDate: -1}).toArray();
    feedbackRequests.pendingFeedback = pendingFeedback;
    feedbackRequests.submitedFeedback = submitedFeedback;
    return feedbackRequests;
}});
