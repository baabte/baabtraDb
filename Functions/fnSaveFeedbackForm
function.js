
/*
Created by : Jihin
Created On : 11/03/2015
Updated On : 15/03, 16/03
Purpose : For Save Feedback Form
*/

db.system.js.save({_id: "fnSaveFeedbackForm",
        value: function(FeedbackForm) {
    
    //converting valid date to isodate formate 
    FeedbackForm.validUntil = ISODate(FeedbackForm.validUntil);
    //setting created and updated date 
    FeedbackForm.createdDate = ISODate();
    FeedbackForm.updatedDate = ISODate();
    //setting urmid and crmId
    FeedbackForm.crmId = ObjectId(FeedbackForm.rmId);
    FeedbackForm.urmId = ObjectId(FeedbackForm.rmId);
    delete FeedbackForm.rmId;
    
    //setting comany Id
    FeedbackForm.companyId = ObjectId(FeedbackForm.companyId);
    //target list desides who will show this feedback
    FeedbackForm.targetList = [];
    
    var feedbackAbout = FeedbackForm.feedbackAbout;
    delete FeedbackForm.feedbackAbout;
    
    //looping through the feedbackon object
    for(var feedbackCount=0; feedbackCount < feedbackAbout.feedbackOn.length; feedbackCount++){
        FeedbackForm.feedbackTypeId = ObjectId(feedbackAbout.feedbackOn[feedbackCount]);
        
        if(FeedbackForm.formAccessTo == "Public"){
            FeedbackForm.targetList = db.clnUserRoleMapping.distinct('_id', {fkCompanyId:FeedbackForm.companyId,activeFlag:1}); 
        }
        
        if(feedbackAbout.type == "course"){
            FeedbackForm.targetList  = FeedbackForm.targetList.concat(db.clnUserCourseMapping.distinct('fkUserRoleMappingId',
                                        {fkCompanyId:FeedbackForm.companyId, fkCourseId:FeedbackForm.feedbackTypeId}));
        }
        
        if(FeedbackForm.targetList.length){
            FeedbackForm._id = new ObjectId();
            FeedbackForm.type = feedbackAbout.type;
            var temp = FeedbackForm.targetList.sort();;
            for(var i=0;(FeedbackForm.targetList.length - 1) > i; i++){  
                if(FeedbackForm.targetList[i].valueOf() == FeedbackForm.targetList[i+1].valueOf()){
                    temp.splice(i,1);
               }
            }
            FeedbackForm.targetList = temp;
            db.clnFeedbacks.insert(FeedbackForm);
            return fnInsertNotificationDetails(FeedbackForm.targetList, FeedbackForm._id, "feedback", FeedbackForm.title, FeedbackForm.crmId);
        }
    }
    
    return {temp:temp.length,list:FeedbackForm.targetList.length};
}});
