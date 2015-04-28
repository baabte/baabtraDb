
/*
Created by : Lijin
Created On : 17/02/2015
Purpose : For submitting answer of a course
*/

/*
Created by : Arun
Created On : 17/02/2015
Purpose : evalStatus add to course element
*/

db.system.js.save({
    "_id" : "fnSaveUserAnswer",
    "value" : function(courseId,userLoginId,keyName,tlPointInmins,outerIndex,innerIndex,answerObj) {
    
    var course=db.clnUserCourseMapping.findOne({fkCourseId:courseId,fkUserLoginId:userLoginId,activeFlag:1});
    var currentMark=0;
    var evalStatus;
    if(answerObj.evaluated==0){
        evalStatus='Pending Evaluation'
    }else if(answerObj.evaluated==1){
        evalStatus='Evaluated'
    }
    course.courseTimeline[tlPointInmins][keyName][outerIndex].evalStatus=evalStatus;
    //checks if he have already scored marks
    if(!course.courseTimeline[tlPointInmins][keyName][outerIndex].markScored){
    course.courseTimeline[tlPointInmins][keyName][outerIndex].markScored=0;  
    }
    //checks if he have already scored marks
    if(!course.courseTimeline[tlPointInmins].markScored){
    course.courseTimeline[tlPointInmins].markScored=0;  
    }
    //checks if he have already scored marks
    if(!course.markScored){
    course.markScored=0;  
    }
    
    // copying current mark for calculations
    currentMark=course.courseTimeline[tlPointInmins][keyName][outerIndex].markScored
    
    //checks if he have already answered this question and if yes then deducts that mark from total mark
    if(course.courseTimeline[tlPointInmins][keyName][outerIndex].elements[innerIndex].value.markScored){
        course.courseTimeline[tlPointInmins][keyName][outerIndex].markScored=currentMark-course.courseTimeline[tlPointInmins][keyName][outerIndex].elements[innerIndex].value.markScored;
        currentMark=course.courseTimeline[tlPointInmins][keyName][outerIndex].markScored;
        course.courseTimeline[tlPointInmins].markScored=course.courseTimeline[tlPointInmins].markScored-course.courseTimeline[tlPointInmins][keyName][outerIndex].elements[innerIndex].value.markScored;
        course.markScored=course.markScored-course.courseTimeline[tlPointInmins][keyName][outerIndex].elements[innerIndex].value.markScored;  
    }
    
    //setting scored mark on question
    for(key in answerObj){
    
    course.courseTimeline[tlPointInmins][keyName][outerIndex].elements[innerIndex].value[key]=answerObj[key];
        
    }
    //course.courseTimeline[tlPointInmins][keyName][outerIndex].elements[innerIndex].value.markScored=answerObj.markScored;
    //course.courseTimeline[tlPointInmins][keyName][outerIndex].elements[innerIndex].value.userAnswer=answerObj.userAnswer;
    
    //adding scored mark to the course element
    course.courseTimeline[tlPointInmins][keyName][outerIndex].markScored=currentMark+answerObj.markScored;
    course.courseTimeline[tlPointInmins].markScored=course.courseTimeline[tlPointInmins].markScored+answerObj.markScored;
    course.markScored=course.markScored+answerObj.markScored;
    
db.clnUserCourseMapping.save(course);
       return {success:true};
}});



//fnSubmitTest
db.system.js.save({
    "_id" : "fnSubmitTest",
    "value" : function (SubmitTestObj) {
          var courseMappingId=ObjectId(SubmitTestObj.courseMappingId);
          var userLoginId=ObjectId(SubmitTestObj.userLoginId);
          var keyName=SubmitTestObj.keyName;
          var tlPointInmins=SubmitTestObj.tlPointInmins;
          var outerIndex=SubmitTestObj.outerIndex;
          var innerIndex=SubmitTestObj.innerIndex;
          var timeObj=SubmitTestObj.timeObj;
          var userAnswers=SubmitTestObj.userAnswers;
          var totalMarkScored=SubmitTestObj.totalMarkScored;
          var uniquekey;
          var resultmsg;
          var targetList=[];

          var evalStatus='';
          for(var index in userAnswers){

            if(userAnswers[index].evaluated==0){
            evalStatus='Pending Evaluation';
            }
          }

          if(evalStatus==''){
            evalStatus='Evaluated';
            }

var course=db.clnUserCourseMapping.findOne({_id:courseMappingId,activeFlag:1});  
uniquekey=course._id.valueOf()+'.'+tlPointInmins+'.'+keyName+'.'+outerIndex;
course.courseTimeline[tlPointInmins][keyName][outerIndex].evalStatus=evalStatus;
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

return {success:true};
}
});


