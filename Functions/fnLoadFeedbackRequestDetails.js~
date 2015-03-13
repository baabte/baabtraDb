
/*
Created by : Jihin
Created On : 11/03/2015
Purpose : Load Feedback Request Details
*/

db.system.js.save({_id: "fnLoadFeedbackRequestDetails",
        value: ffunction(companyId, feedbackId, rmId) {
    var feedbackDetails = db.clnFeedbacks.findOne({_id:ObjectId(feedbackId), companyId:ObjectId(companyId), userResponse:{$elemMatch:{rmId:ObjectId(rmId)}}},{questions:1,userResponse:1});
    if(feedbackDetails == null){
            feedbackDetails = db.clnFeedbacks.findOne({_id:ObjectId(feedbackId), companyId:ObjectId(companyId)},{userResponse:0});
        }
    return feedbackDetails;
}});
