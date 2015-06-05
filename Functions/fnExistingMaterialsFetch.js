//fnExistingMaterialsFetch

db.system.js.save({_id:'fnExistingMaterialsFetch',
value:function(data) {
  var courseId=ObjectId(data.courseId);

  var course=db.clnCourses.findOne({_id:courseId},{courseTimeline:1,syllabus:1})

	return course;

}});