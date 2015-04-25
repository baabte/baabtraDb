//fnEvaluateAnswer
db.system.js.save({_id: "fnEvaluateAnswer",
      value: function (data) {
      	var userCourseMappingId=ObjectId(data.userCourseMappingId);
		var tlPoint=data.tlPoint;
		var elementType=data.elementType;
		var outerIndex=data.outerIndex;
		var evaluationobj=data.evaluationobj;
		var oldCourseMark=0;//to keep old course mark;
		var oldtlpointMark=0;// keep old course mark;
		var oldelementMark=0;//to keep old element mark;
		var newtlpointMark=0; //to keep new tlpint mark;
		var newelementMark=evaluationobj.markScored; //new course element mark;

		// evaluationobj.evaluatedBy=ObjectId(evaluationobj.evaluatedBy);

		

		var course=db.clnUserCourseMapping.findOne({_id:userCourseMappingId});//taking that course element back to update
		oldCourseMark=course.markScored; //keeping prevoius score @ course level
		oldtlpointMark=course.courseTimeline[tlPoint].markScored; //keeping prevoius score @ time-line  level
		oldelementMark=course.courseTimeline[tlPoint][elementType][outerIndex].markScored; //keeping prevoius score @ element level

		//updating 
		course.courseTimeline[tlPoint].markScored-=oldelementMark;
		course.courseTimeline[tlPoint].markScored+=newelementMark;
		newtlpointMark=course.courseTimeline[tlPoint].markScored;
		course.markScored-=oldtlpointMark;
		course.markScored+=newtlpointMark;

		course.courseTimeline[tlPoint][elementType][outerIndex]=evaluationobj;

		db.clnUserCourseMapping.save(course);
      	return 'evaluated sucessfully';
      }});