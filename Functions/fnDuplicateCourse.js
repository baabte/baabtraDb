//fnDuplicateCourse

db.system.js.save({_id: "fnDuplicateCourse",
		value: function (data){

			var course=db.clnCourses.findOne({_id:ObjectId(data.courseId)});
			delete course._id;
			course.Name='Copy Of '+course.Name;
			course.updatedDate=Date();
			course.createdDate=Date();
			course.crmId=ObjectId(data.rmId);
			course.urmId=ObjectId(data.rmId);

			db.clnCourses.insert(course);

			return 'success'

}
});