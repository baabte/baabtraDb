db.system.js.save({_id: "fnDeleteDraftedCourse",
		value: function (manageType, courseId, urmId, courseType, companyId) {
    if (manageType.activeFlag == 0) {
        var course = db.clnCourses.find({_id:courseId}).toArray();
        db.clnArchiveCourses.insert(course);
        db.clnCourses.remove({_id:courseId});
        db.clnArchiveCourses.update({_id:courseId}, {$set:{updatedDate:Date(), urmId:urmId}});
    } else if (manageType.activeFlag == 1) {
        var course = db.clnArchiveCourses.find({_id:courseId}).toArray();
        db.clnCourses.insert(course);
        db.clnArchiveCourses.remove({_id:courseId});
        db.clnCourses.update({_id:courseId}, {$set:{updatedDate:Date(), urmId:urmId}});
    }
    if (courseType == "Draft") {
        return fnGetDraftedCourses(companyId);
    } else if (courseType == "Publish") {
        return fun_load_publishedCourses(companyId.valueOf(), "", "", "", "");
    }
}});
