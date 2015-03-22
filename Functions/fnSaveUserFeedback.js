
/*
Created by : Jihin
Created On : 11/03/2015
Update On  : 12/03, 15/03 
Purpose : for Save User Feedback
*/

db.system.js.save({_id: "fnSaveUserFeedback",
        value: function(feedbackId, feedback, rmId) {
    var feedbackObj = db.clnFeedbacks.findOne({_id:ObjectId(feedbackId)});
    if(feedbackObj.userResponse == undefined){
        feedbackObj.userResponse = [];
        }
    feedback.userResponse.rmId = ObjectId(feedback.userResponse.rmId);
    feedbackObj.userResponse.push(feedback.userResponse);
        
    for(var questionsCount = 0; questionsCount < feedbackObj.questions.length; questionsCount++){
            var dataObject = feedbackObj.questions[questionsCount].data;
            for(optionsCount = 1; optionsCount < dataObject.length; optionsCount++){
                    
                    if(feedback['responseObject'][questionsCount].indexOf(dataObject[optionsCount][0]) != -1){
                        dataObject[optionsCount][1] = dataObject[optionsCount][1] + 1;
                    } 
                }
        }
    feedbackObj.responseCount = feedbackObj.responseCount + 1;
    feedbackObj.updatedDate = ISODate();
    
     
    db.clnFeedbacks.save(feedbackObj);
    //fn for archive user notification
    return fnArchiveUserNotification(rmId, feedbackId, rmId);
}});
