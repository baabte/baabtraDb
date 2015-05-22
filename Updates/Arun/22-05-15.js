//fnDuplicateCourse

db.system.js.save({_id: "fnDuplicateCourse",
		value: function (data){

			var course=db.clnCourses.findOne({_id:ObjectId(data.courseId)});
			delete course._id;
			course._id=new ObjectId();
			course.Name='Copy Of '+course.Name;
			course.updatedDate=Date();
			course.createdDate=Date();
			course.crmId=ObjectId(data.rmId);
			course.urmId=ObjectId(data.rmId);

			db.clnCourses.insert(course);

			return {Name:course.Name,_id:course._id,companyId:course.companyId,courseDetails:course.courseDetails,courseImg:course.courseImg}

}
});