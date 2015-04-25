
db.system.js.save({
    "_id" : "fnAddCourseDetails",
    "value" : function(courseDetails, courseId) {
   
            
    if(courseId == ""){//checking if the course is already exist
        var courseId=new ObjectId();
        courseDetails._id=courseId;
        
        }
        else{
            courseDetails._id=courseId;
        }
    db.clnCourses.save(courseDetails);
    return courseId;
}});
