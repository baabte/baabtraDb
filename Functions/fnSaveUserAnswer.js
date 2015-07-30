
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


db.system.js.save({_id: "fnSaveUserAnswer",
        value: function (courseId, userLoginId, keyName, tlPointInmins, outerIndex, innerIndex, answerObj) {
    var course = db.clnUserCourseMapping.findOne({fkCourseId:courseId, fkUserLoginId:userLoginId, activeFlag:1});
    var currentMark = 0;
    var evalStatus;
    if (answerObj.evaluated == 0) {
        evalStatus = "Pending Evaluation";
    } else if (answerObj.evaluated == 1) {
        evalStatus = "Evaluated";
    } else if (answerObj.evaluated == 2) {
        evalStatus = "Draft";
    }
    course.courseTimeline[tlPointInmins][keyName][outerIndex].evalStatus = evalStatus;
    if (!course.courseTimeline[tlPointInmins][keyName][outerIndex].markScored || course.courseTimeline[tlPointInmins][keyName][outerIndex].markScored == null) {
        course.courseTimeline[tlPointInmins][keyName][outerIndex].markScored = 0;
    }
    if (!course.courseTimeline[tlPointInmins].markScored || course.courseTimeline[tlPointInmins].markScored == null ) {
        course.courseTimeline[tlPointInmins].markScored = 0;
    }
    if (!course.markScored || course.markScored == null) {
        course.markScored = 0;
    }
    //!course.courseTimeline[tlPointInmins][keyName][outerIndex].markScored || 
    if(course.courseTimeline[tlPointInmins][keyName][outerIndex].markScored != null){
        currentMark = course.courseTimeline[tlPointInmins][keyName][outerIndex].markScored;
    }
    else{
        currentMark = 0;
    }
    if (course.courseTimeline[tlPointInmins][keyName][outerIndex].elements[innerIndex].value.markScored==null||course.courseTimeline[tlPointInmins][keyName][outerIndex].elements[innerIndex].value.markScored!=undefined) {
       if (course.courseTimeline[tlPointInmins][keyName][outerIndex].elements[innerIndex].value.markScored==null){
            course.courseTimeline[tlPointInmins][keyName][outerIndex].elements[innerIndex].value.markScored = 0;
       }
       course.courseTimeline[tlPointInmins][keyName][outerIndex].markScored = currentMark - course.courseTimeline[tlPointInmins][keyName][outerIndex].elements[innerIndex].value.markScored;
       currentMark = course.courseTimeline[tlPointInmins][keyName][outerIndex].markScored;
        course.courseTimeline[tlPointInmins].markScored = course.courseTimeline[tlPointInmins].markScored - course.courseTimeline[tlPointInmins][keyName][outerIndex].elements[innerIndex].value.markScored;
        course.markScored = course.markScored - course.courseTimeline[tlPointInmins][keyName][outerIndex].elements[innerIndex].value.markScored;
    }
   for (key in answerObj) {
        course.courseTimeline[tlPointInmins][keyName][outerIndex].elements[innerIndex].value[key] = answerObj[key];
    }
    if(answerObj.markScored == null){
        answerObj.markScored = 0;
    }
    course.courseTimeline[tlPointInmins][keyName][outerIndex].markScored = currentMark + answerObj.markScored;
    course.courseTimeline[tlPointInmins].markScored = course.courseTimeline[tlPointInmins].markScored + answerObj.markScored;
    course.markScored = course.markScored + answerObj.markScored;
    db.clnUserCourseMapping.save(course);
    return {success:true};
}});

