/* created by:midhun

Modified by:Lijin
Date:20-2-2015
purpose:added markScored,totalMark in projection 

Modified by:Arun
Date:4-5-2015
purpose:added element order in return 

*/

db.system.js.save({_id: "fnLoadCourseData",
		value: function (courseId,userLoginId,roleid) {if(roleid==3){
        courses = db.clnUserCourseMapping.findOne({"fkUserLoginId" : ObjectId(userLoginId),"fkCourseId":ObjectId(courseId),"activeFlag" : 1},{courseTimeline:1,Duration:1,markScored:1,totalMark:1,selectedDuration:1,elementOrder:1});
    return courses;
        }
        else{
            courses = db.clnCourses.findOne({"_id" : ObjectId(courseId),"activeFlag" : 1});
            return courses;
            
            }}});
