db.system.js.save({
    "_id" : "fnLoadUserProfileDetails",
    "value" :function (loginId) {
    var userDetails = db.clnUserDetails.findOne({fkUserLoginId:ObjectId(loginId)});
    var courses = db.clnUserCourseMapping.find({fkUserLoginId:ObjectId(loginId),activeFlag:1},{courseTimeline:0,elementOrder:0}).toArray();
    var {userDetails:userDetails, courses:courses};
    }});