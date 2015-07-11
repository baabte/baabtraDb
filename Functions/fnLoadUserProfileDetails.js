db.system.js.save({
    "_id" : "fnLoadUserProfileDetails",
    "value" :function (loginId, type) {
	
    var userDetails = db.clnUserDetails.findOne({fkUserLoginId:ObjectId(loginId)});
	var unWantedFeilds = {Description:0, courseImg:0, markSheetElements:0, courseTimeline:0,elementOrder:0}; 
	if(type == "summary"){
		unWantedFeilds.syllabus = 0;
	}
    var courses = db.clnUserCourseMapping.find({fkUserLoginId:ObjectId(loginId),activeFlag:1},unWantedFeilds).toArray();
    return {userDetails:userDetails, courses:courses};
    }});
