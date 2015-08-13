db.system.js.save({
    "_id" : "fnLoadUserProfileDetails",
    "value" : function (loginId, type) {
    var userDetails = db.clnUserDetails.findOne({fkUserLoginId:ObjectId(loginId)});
    var userRoleMapping = db.clnUserRoleMapping.findOne({fkUserLoginId:ObjectId(loginId)});
    userDetails.roleMappingId = userRoleMapping._id;
    var projection = {Description:0, courseImg:0, markSheetElements:0, courseTimeline:0, elementOrder:0};
    if (type == "summary") {
        projection.syllabus = 0;
    }
	
    if (type == "byCourse") {
        projection = {Name:1, type:1, fkCourseId:1};
    }
	
    var courses = db.clnUserCourseMapping.find({fkUserLoginId:ObjectId(loginId), activeFlag:1}, projection).toArray();
    return {userDetails:userDetails, courses:courses};
}});
