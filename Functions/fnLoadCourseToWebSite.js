/*
Created by: Jihin
Created on: 13/APR/2015
Purpose : For load course to webistes
*/

db.system.js.save({_id: "fnLoadCourseToWebSite",
	value: function(companyId) {
	var courses = db.clnCourses.find({companyId:ObjectId(companyId), draftFlag:1, activeFlag:1, publishToWebsite:true}).toArray();
	return courses;
}});
