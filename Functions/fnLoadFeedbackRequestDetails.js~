
/*
Created by : Jihin
Created On : 11/03/2015
Purpose : Load Feedback Request Details
*/

db.system.js.save({_id: "fnLoadFeedbackRequestDetails",
        value: function(companyId, feedbackId, rmId) {
    var feedbackDetails = db.clnFeedbacks.findOne({_id:ObjectId(feedbackId), companyId:ObjectId(companyId), userResponse:{$elemMatch:{rmId:ObjectId(rmId)}}},{title:1,description:1,type:1,feedbackTypeId:1,questions:1,userResponse:1});
    if(feedbackDetails == null){
            feedbackDetails = db.clnFeedbacks.findOne({_id:ObjectId(feedbackId), companyId:ObjectId(companyId)},{userResponse:0});
        }
    return feedbackDetails;
}});
