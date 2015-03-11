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
