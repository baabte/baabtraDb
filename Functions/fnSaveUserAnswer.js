
/*
Created by : Lijin
Created On : 17/02/2015
Purpose : For submitting answer of a course
*/

db.system.js.save({_id: "fnSaveUserAnswer",
		value: function(courseId,userLoginId,keyName,tlPointInmins,outerIndex,innerIndex,answerObj) {
    var obj={};
    var key='courseTimeline.'+tlPointInmins+'.'+keyName;
        obj[key]=1;
    var course=db.clnUserCourseMapping.findOne({fkCourseId:courseId,fkUserLoginId:userLoginId},obj);
    course.courseTimeline[tlPointInmins][keyName][outerIndex].elements[innerIndex].value.markScored=answerObj.markScored;
    course.courseTimeline[tlPointInmins][keyName][outerIndex].elements[innerIndex].value.userAnswer=answerObj.userAnswer;
  
var updateObj={};
    updateObj[key]=course.courseTimeline[tlPointInmins][keyName];
db.clnUserCourseMapping.update({fkCourseId:courseId,fkUserLoginId:userLoginId},{$set:updateObj});
       return "ok";}});