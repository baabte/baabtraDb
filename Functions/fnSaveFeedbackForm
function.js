
/*
Created by : Jihin
Created On : 11/03/2015
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
            db.clnFeedbacks.insert(FeedbackForm);
        }
    }
    
    return FeedbackForm;
}});
