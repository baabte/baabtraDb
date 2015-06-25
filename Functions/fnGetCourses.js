//fnGetCourses

db.system.js.save({
    "_id" : "fnGetCourses",
    "value" : function(data) {

    	var companyId=ObjectId(data.companyId);

  var Courses=db.clnCourses.find({companyId:companyId,activeFlag:1,courseTimeline:{$exists:1},type:'course'},{_id:1,Name:1,draftFlag:1}).toArray();
  
	return Courses;

}});