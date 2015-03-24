//fnTestTimeReCheck
db.system.js.save({_id: "fnTestTimeReCheck",
                  value: function (data) {

    var userCourseMappingId=ObjectId(data.courseMappingId);
    var keyName=data.keyName;
    var tlPointInmins=data.tlPointInmins;
    var outerIndex=data.outerIndex;
    var innerIndex=data.innerIndex;
    
   var course=db.clnUserCourseMapping.findOne({_id:userCourseMappingId},{courseTimeline:1});

return {startTime:course.courseTimeline[tlPointInmins][keyName][outerIndex].testStartTime,timeDetails:{actualDuration:course.courseTimeline[tlPointInmins][keyName][outerIndex].elements[innerIndex].value.actualDuration,duration:course.courseTimeline[tlPointInmins][keyName][outerIndex].elements[innerIndex].value.duration}};


}});