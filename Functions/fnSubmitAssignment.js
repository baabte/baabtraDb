db.system.js.save({_id: "fnAddCoursesToBatch",
		value:function(objToBeSaved) {
    // write your code here
    
    //getting the details of the course element into an object
    var objDetails = objToBeSaved.objDetails;
    
    
    //looping throgh the answer array to update the individual marks inside the assignment
    for(var i in objToBeSaved.answerArray) {
        var currentAnswer = objToBeSaved.answerArray[i];
        fnSaveUserAnswer(currentAnswer.courseId,currentAnswer.userLoginId,currentAnswer.keyName,currentAnswer.tlPointInmins,currentAnswer.outerIndex,currentAnswer.innerIndex,currentAnswer.answerObj); 
    }
    
    //getting the course mapping object into a variable
    var courseMapping = db.clnUserCourseMapping.findOne({_id:ObjectId(objToBeSaved.courseMappingId)});
    
    //getting the concerned element into a variable
    var courseElement = courseMapping.courseTimeline[objDetails.tlPointInMinute][objDetails.Name][objDetails.index];    
    
    //updating the element level marks
    if(courseElement.markScored == undefined) {
        courseElement.markScored = 0;
    }
    
    var effectiveMark = parseInt(objToBeSaved.markScored) - parseInt(courseElement.markScored);
   
    courseElement.markScored = parseInt(courseElement.markScored) + effectiveMark;
    
    //updating the timeline point level marks
    if(courseMapping.courseTimeline[objDetails.tlPointInMinute].markScored == undefined) {
        courseMapping.courseTimeline[objDetails.tlPointInMinute].markScored = 0;
    }
    
    courseMapping.courseTimeline[objDetails.tlPointInMinute].markScored = parseInt(courseMapping.courseTimeline[objDetails.tlPointInMinute].markScored) + effectiveMark;
    
    //updating the course level marks
    if(courseMapping.markScored == undefined) {
        courseMapping.markScored = 0;
    }
    
    courseMapping.markScored = parseInt(courseMapping.markScored) + effectiveMark;   
    
  
    
  //updating the other details
    courseElement.status = objToBeSaved.status;
    courseElement.statusHistory = objToBeSaved.statusHistory;
    courseElement.penaltyHistory  = objToBeSaved.penaltyHistory;
    courseElement.lastUpdatedBy = objToBeSaved.lastUpdatedBy;
    
    
    //saving the final object to the collection
    db.clnUserCourseMapping.save(courseMapping);

          return {result:'success'};


}});
     
