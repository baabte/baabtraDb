//fnSubmitTest
db.system.js.save({_id: "fnSubmitTest",
                  value: function (SubmitTestObj) {
          var courseMappingId=ObjectId(SubmitTestObj.courseMappingId);
          var userLoginId=ObjectId(SubmitTestObj.userLoginId);
          var keyName=SubmitTestObj.keyName;
          var tlPointInmins=SubmitTestObj.tlPointInmins;
          var outerIndex=SubmitTestObj.outerIndex;
          var innerIndex=SubmitTestObj.innerIndex;
          var timeObj=SubmitTestObj.timeObj;
          var userAnswers=SubmitTestObj.userAnswers;
          var totalMarkScored=SubmitTestObj.totalMarkScored;
          var resultmsg;

var course=db.clnUserCourseMapping.findOne({_id:courseMappingId,activeFlag:1});  

//checks if he have already scored marks
    if(!course.courseTimeline[tlPointInmins][keyName][outerIndex].markScored){
    course.courseTimeline[tlPointInmins][keyName][outerIndex].markScored=0;  
    }
   
    course.courseTimeline[tlPointInmins][keyName][outerIndex].markScored=course.courseTimeline[tlPointInmins][keyName][outerIndex].markScored+totalMarkScored;
    //checks if he have already scored marks
    if(!course.courseTimeline[tlPointInmins].markScored){
    course.courseTimeline[tlPointInmins].markScored=0;  
    }
   
    course.courseTimeline[tlPointInmins].markScored=course.courseTimeline[tlPointInmins].markScored+totalMarkScored;
   
    //checks if he have already scored marks
    if(!course.markScored){
    course.markScored=0;  
    }  
   
    course.markScored=course.markScored+totalMarkScored;
    
     course.courseTimeline[tlPointInmins][keyName][outerIndex][timeObj.key]=timeObj.value;  
   

    for(var index in userAnswers){
    	for(var key in userAnswers[index]){
    course.courseTimeline[tlPointInmins][keyName][outerIndex].elements[innerIndex].value.testModel[index][key]=userAnswers[index][key];
        }
    }

db.clnUserCourseMapping.save(course);


return course;
}});


//fnSaveTestStartTime
db.system.js.save({_id: "fnSaveTestStartTime",
                  value: function (StartTimeObj) {
                  
          var courseMappingId=ObjectId(StartTimeObj.courseMappingId);
          var userLoginId=ObjectId(StartTimeObj.userLoginId);
          var keyName=StartTimeObj.keyName;
          var tlPointInmins=StartTimeObj.tlPointInmins;
          var outerIndex=StartTimeObj.outerIndex;
          var innerIndex=StartTimeObj.innerIndex;
          var timeObj=StartTimeObj.timeObj;
          var resultmsg;

var course=db.clnUserCourseMapping.findOne({_id:courseMappingId,activeFlag:1});
    
    //checks if he have already scored marks
    if(!course.courseTimeline[tlPointInmins][keyName][outerIndex][timeObj.key]){
    course.courseTimeline[tlPointInmins][keyName][outerIndex][timeObj.key]=timeObj.value;  
    db.clnUserCourseMapping.save(course);
    resultmsg='test Started';
    }
    else{
      resultmsg='test already started or finished';
    }
return {result:resultmsg};
}});
