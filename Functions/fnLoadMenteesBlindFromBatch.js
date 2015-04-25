db.system.js.save({
    "_id" : "fnLoadMenteesBlindFromBatch",
    "value" : function (batchMappingId,date) {
    var count = 0;
    var batchObj = db.clnCourseBatchMapping.findOne({_id:ObjectId(batchMappingId), activeFlag:1},{courseTimeline:0});
    var markedUrmIds=db.clnCandidateAttendance.distinct('fkUserRoleMappingId',{batchMappingId:batchMappingId,activeFlag:1,date:ISODate(date)});
    var urmIds = db.clnCourseBatchMapping.distinct("users.fkUserRoleMappingId", {_id:ObjectId(batchMappingId),"users.fkUserRoleMappingId":{$nin:markedUrmIds},activeFlag:1});
    var userCourseList = db.clnUserCourseMapping.find({fkCourseId:batchObj.fkCourseId, fkUserRoleMappingId:{$in:urmIds}, activeFlag:1}, {_id:1,fkUserLoginId:1,fkUserRoleMappingId:1}).toArray();
    while (userCourseList.length > count) {
        userCourseList[count].profile = {};
        var profile = db.clnUserDetails.findOne({fkUserLoginId:userCourseList[count].fkUserLoginId, activeFlag:1}, {"profile.firstName":1,"profile.lastName":1, _id:0});
        if(profile){
        userCourseList[count].profile.firstName=profile.profile.firstName;
        userCourseList[count].profile.lastName=profile.profile.lastName;
        }
        var userName = db.clnUserLogin.findOne({_id:userCourseList[count].fkUserLoginId, activeFlag:1}, {userName:1, _id:0});
        userCourseList[count].userName=userName.userName;
        var avatar = db.clnUserRoleMapping.findOne({_id:userCourseList[count].fkUserRoleMappingId, activeFlag:1}, {avatar:1, _id:0});
        userCourseList[count].avatar=avatar.avatar;
        count++;
    }
    if (batchObj.courseTimeline == undefined) {
        batchObj.courseTimeline = {};
        batchObj.elementOrder = {};
    }
    return {batchList:batchObj, userDetails:userCourseList,markedUrmIds:markedUrmIds};
}
});
