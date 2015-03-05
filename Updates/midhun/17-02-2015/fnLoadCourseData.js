db.system.js.save({_id: "fnLoadCourseData",
<<<<<<< HEAD
		value: function (courseId,userLoginId,roleid) {
    			
				if(roleid==3){
=======
		value: function (courseId,userLoginId,roleid) {if(roleid==3){
>>>>>>> 456341aecf176e4902f267071acc97f0fa0c797b
        courses = db.clnUserCourseMapping.findOne({"fkUserLoginId" : ObjectId(userLoginId),"fkCourseId":ObjectId(courseId),"activeFlag" : 1},{courseTimeline:1,Duration:1});
    return courses;
        }
        else{
            courses = db.clnCourses.findOne({"_id" : ObjectId(courseId),"activeFlag" : 1});
            return courses;
            
            }}});
