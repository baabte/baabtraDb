//fnMarkAttendence
db.system.js.save({_id: "fnMarkAttendence",
      value: function (data) {
      	var course=db.clnUserCourseMapping.findOne({_id:ObjectId(data.userCourseMappingId)});
      	course.courseTimeline[data.tlpoint][data.userCourseElementType][data.innerIndex].attendence=data.attendence;
		db.clnUserCourseMapping.save(course);
		return 'attendence marked'; 
      }});
