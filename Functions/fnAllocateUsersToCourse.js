//fnAllocateUsersToCourse

db.system.js.save({
    "_id" : "fnAllocateUsersToCourse",
    "value" : function(courseAllocate) {
    	var loggedusercrmid=ObjectId(courseAllocate.loggedusercrmid);
    	var companyId=ObjectId(courseAllocate.companyId);
    	var date=courseAllocate.date;
        var childCompanyId='';
                if (courseAllocate.childCompanyId) {
                 childCompanyId = courseAllocate.childCompanyId;
                };
    	delete courseAllocate.date;
    	var courseId=ObjectId(courseAllocate.selectedCourse._id)
    	delete courseAllocate.selectedCourse;
    	var course = db.clnCourses.findOne({_id:courseId},{_id:0, Name:1, courseTimeline:1, Duration:1, Description:1, courseImg:1, totalMark:1, selectedDuration:1, elementOrder:1,syllabus:1,markSheetElements:1});
    	if (childCompanyId!='') {
        var UserCourseMappingData = {fkCompanyId:companyId, fkCourseId:courseId, Name:course.Name, Duration:course.Duration, Description:course.Description, courseImg:course.courseImg, totalMark:course.totalMark, selectedDuration:course.selectedDuration, courseTimeline:course.courseTimeline,syllabus:course.syllabus,markSheetElements:course.markSheetElements, elementOrder:course.elementOrder, createdDate:date, updatedDate:date, crmId:loggedusercrmid, urmId:loggedusercrmid, activeFlag:1, markScored:0,childCompanyId:childCompanyId};
    	}
        else{
        var UserCourseMappingData = {fkCompanyId:companyId, fkCourseId:courseId, Name:course.Name, Duration:course.Duration, Description:course.Description, courseImg:course.courseImg, totalMark:course.totalMark, selectedDuration:course.selectedDuration, courseTimeline:course.courseTimeline,syllabus:course.syllabus,markSheetElements:course.markSheetElements, elementOrder:course.elementOrder, createdDate:date, updatedDate:date, crmId:loggedusercrmid, urmId:loggedusercrmid, activeFlag:1, markScored:0};

        }
        for(var key in courseAllocate.selectedUsers){
			UserCourseMappingData.fkUserLoginId=ObjectId(key);
            var UserRoleMappingId=db.clnUserRoleMapping.findOne({fkUserLoginId:UserCourseMappingData.fkUserLoginId,fkRoleId:3,"profile.fkCompanyId":companyId,activeFlag:1},{_id:1});
			UserCourseMappingData.fkUserRoleMappingId=UserRoleMappingId._id;

			db.clnUserCourseMapping.update({fkUserLoginId:UserCourseMappingData.fkUserLoginId,fkUserRoleMappingId:UserCourseMappingData.fkUserRoleMappingId, fkCourseId:courseId, activeFlag:1},{$set:{activeFlag:0}});
                db.clnUserCourseMapping.insert(UserCourseMappingData);

		    }
    	return UserCourseMappingData;
}
});