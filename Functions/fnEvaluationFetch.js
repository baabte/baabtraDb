//fnEvaluationFetch
db.system.js.save({_id: "fnEvaluationFetch",
      value: function (data) {
      	var userCourseMappingId=ObjectId(data.userCourseMappingId);
		var tlPoint=data.tlPoint;
		var elementType=data.elementType;
		var outerIndex=data.outerIndex;


		var course=db.clnUserCourseMapping.findOne({_id:userCourseMappingId},{courseTimeline:1});

		return course.courseTimeline[tlPoint][elementType][outerIndex];
      
    }});