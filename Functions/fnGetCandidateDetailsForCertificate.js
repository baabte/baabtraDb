db.system.js.save({
    "_id" : "fnGetCandidateDetailsForCertificate",
    "value" : function (rmId, courseId) {
    var tmp;
    var returnObj = {};
    var userCD = fnLoadUserCourseDetails([rmId], courseId)[0];
    returnObj.syllabus = userCD.syllabus;
    returnObj.courseName = userCD.Name;
    var userCourseMapping = db.clnUserCourseMapping.findOne({fkUserRoleMappingId:ObjectId(rmId), fkCourseId:ObjectId(courseId), activeFlag:1});
    var companyDetails = db.clnCompany.findOne({_id:userCourseMapping.fkCompanyId}, {_id:0, appSettings:0, fkuserLoginId:0, activeFlag:0});
    returnObj.companyDetails = companyDetails;
    if (userCourseMapping.batchCourseMappingId) {
        returnObj.attendance = db.clnCandidateAttendance.find({fkUserRoleMappingId:ObjectId(rmId), courseId:courseId, batchMappingId:userCourseMapping.batchCourseMappingId.valueOf(), activeFlag:1}, {status:1, _id:0}).toArray();
    }
    var userDetails = fnLoadUserCardDetail(rmId);
    returnObj.userDetails = userDetails;
    var userInfo = db.clnUserDetails.findOne({fkUserLoginId:userDetails.loginId}, {'profile.orderFormId':1});
    if (userInfo.profile.orderFormId) {
        var orderFormId = db.clnTrainingRequest.findOne({_id:ObjectId(userInfo.profile.orderFormId)},{"customCompanyCode":1,_id:0});
            returnObj.orderFormId = orderFormId.customCompanyCode;
        var orderForm = db.clnTrainingRequest.findOne({_id:ObjectId(userInfo.profile.orderFormId), 'orderDetails.userInfo.statusHistory.statusChangedTo':{$in:["paid","Paid"]}, 'orderDetails.userInfo.userLoginId':userDetails.loginId.valueOf()});
        returnObj.orderForm = orderForm;
    }
    return returnObj;
}
});