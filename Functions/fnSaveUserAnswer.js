
/*
Created by : Lijin
Created On : 17/02/2015
Purpose : For submitting answer of a course
*/

db.system.js.save({_id: "fnSaveUserAnswer",
		value: function(courseId,userLoginId,keyName,tlPointInmins,outerIndex,innerIndex,answerObj) {
    
    var course=db.clnUserCourseMapping.findOne({fkCourseId:courseId,fkUserLoginId:userLoginId});
    var currentMark=0;
    
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
    course.courseTimeline[tlPointInmins][keyName][outerIndex].elements[innerIndex].value.markScored=answerObj.markScored;
    course.courseTimeline[tlPointInmins][keyName][outerIndex].elements[innerIndex].value.userAnswer=answerObj.userAnswer;
    //adding scored mark to the course element
    course.courseTimeline[tlPointInmins][keyName][outerIndex].markScored=currentMark+answerObj.markScored;
    course.courseTimeline[tlPointInmins].markScored=course.courseTimeline[tlPointInmins].markScored+answerObj.markScored;
    course.markScored=course.markScored+answerObj.markScored;
    
db.clnUserCourseMapping.save(course);
       return {success:true};}});