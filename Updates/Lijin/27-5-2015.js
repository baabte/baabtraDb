db.system.js.save({
    "_id" : "fnEnrollUser",
    "value" : function (data) {
    var _id = db.clnUserDetails.findOne({fkUserLoginId:ObjectId(data.mandatoryData.userLoginId)},{_id:1,profile:1});
    data.mandatoryData.orderFormId=_id.profile.orderFormId;
    data._id = _id._id.valueOf();
    fnRegisterUser(data);
    return data;
}});

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

db.system.js.save({
_id:"fnLoadMenteesForPayment",
"value":function(companyId,pageNumber, nPerPage,searchKey){
var data = {};
    data.type = "regex";
    data.orderFroms = db.clnTrainingRequest.find({
        $or:[
                {status:{$regex:new RegExp(searchKey, "i")}},
                {'requesteeDetails.eMail':{$regex:new RegExp(searchKey, "i")}},
                {customCompanyCode:{$regex:new RegExp(searchKey, "i")}},
                {'requesteeDetails.type':{$regex:new RegExp(searchKey, "i")}},
                {'orderDetails.userInfo.userCode':{$regex:new RegExp(searchKey, "i")}}
            ],
            companyId:ObjectId(companyId),
            //'orderDetails.userInfo.status':{$in:statusType}
            'orderDetails.userInfo.statusHistory.statusChangedTo':{$nin:["paid","Paid"]},
            }).skip(pageNumber > 0 ? (pageNumber - 1) * nPerPage : 0).sort({customCompanyCode:-1}).limit(nPerPage).toArray();
    return data;
}});

db.system.js.save({_id:'fnLoadMenteesForApprove',
value:function(companyId, statusType, pageNumber, nPerPage, searchKey) {
    var data = {};
    data.type = "text";
    data.orderFroms = [];//db.clnTrainingRequest.find({$text: { $search: searchKey }, companyId:ObjectId(companyId), "orderDetails.userInfo.status":{$in:statusType}}).skip(
    //pageNumber > 0 ? ((pageNumber-1)*nPerPage) : 0).sort({customCompanyCode:-1}).limit(nPerPage).toArray();
    if(!data.orderFroms.length){
    data.type = "regex";
        data.orderFroms = db.clnTrainingRequest.find({
            $or:[
            {"status" :{$regex:new RegExp(searchKey,'i')}},
            {"requesteeDetails.eMail" :{$regex:new RegExp(searchKey,'i')}},
            {"customCompanyCode" :{$regex:new RegExp(searchKey,'i')}},
            {"requesteeDetails.type" :{$regex:new RegExp(searchKey,'i')}},
            {'orderDetails.userInfo.userCode':{$regex:new RegExp(searchKey, "i")}}
            ], companyId:ObjectId(companyId), "orderDetails.userInfo.status":{$in:statusType}}).skip(
    pageNumber > 0 ? ((pageNumber-1)*nPerPage) : 0).sort({customCompanyCode:-1}).limit(nPerPage).toArray();
    }
    return data;
}});