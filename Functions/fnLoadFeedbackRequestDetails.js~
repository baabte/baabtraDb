
/*
Created by : Jihin
Created On : 11/03/2015
Purpose : Load Feedback Request Details
*/

db.system.js.save({_id: "fnLoadFeedbackRequestDetails",
        value: function(companyId, feedbackId) {
    var feedbackDetails = db.clnFeedbacks.find({_id:ObjectId(feedbackId),companyId:ObjectId(companyId)}).toArray();
    return feedbackDetails;
}});
