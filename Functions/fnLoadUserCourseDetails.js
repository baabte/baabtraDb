/*
Created by : Jihin
Date : 23-04-2015
purpose : Load User Course Details
*/

db.system.js.save({_id: "fnLoadUserCourseDetails",
	value:function(usersList, courseId) {
    for(var userCount = 0; userCount < usersList.length ; userCount++){
        usersList[userCount] = ObjectId(usersList[userCount]);
    }
    var UserCourseDetails = db.clnUserCourseMapping.find({fkUserRoleMappingId:{$in:usersList},fkCourseId:ObjectId(courseId), activeFlag:1}).toArray();
    return UserCourseDetails;
}});
