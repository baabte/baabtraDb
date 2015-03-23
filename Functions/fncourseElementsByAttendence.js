//fncourseElementsByAttendence 
db.system.js.save({_id: "fncourseElementsByAttendence",
      value: function (data) {
      	var userCourseMappingId=ObjectId(data.userCourseMappingId);
      	var userCourseTimelineData=db.clnUserCourseMapping.findOne({_id:userCourseMappingId},{courseTimeline:1,_id:0});
      	var userCourseElementlist=[];
      	for(var tlpoint in userCourseTimelineData.courseTimeline){
      		for(var userCourseElementType in userCourseTimelineData.courseTimeline[tlpoint]){
      			if(typeof userCourseTimelineData.courseTimeline[tlpoint][userCourseElementType]=='object'){
      				for(var innerIndex in userCourseTimelineData.courseTimeline[tlpoint][userCourseElementType]){
      					if(userCourseTimelineData.courseTimeline[tlpoint][userCourseElementType][innerIndex].attendenceTrack==true){

      		    		userCourseElementlist.push({tlpoint:tlpoint,userCourseElementType:userCourseElementType,innerIndex:innerIndex,courseElement:userCourseTimelineData.courseTimeline[tlpoint][userCourseElementType][innerIndex]});
      		    		}
      				}
      			}
      		}
      	}
        
      	return userCourseElementlist;
}});
