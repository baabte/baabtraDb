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




db.system.js.save({
    "_id" : "fnLoadMenteesMarkedAttendanceFromBatch",
    "value" : function (batchMappingId,date) {
    var count = 0;
    //var batchObj = db.clnCourseBatchMapping.findOne({_id:ObjectId(batchMappingId), activeFlag:1});
    //var markedUrmIds=db.clnCandidateAttendance.distinct('fkUserRoleMappingId',{batchMappingId:batchMappingId,activeFlag:1,date:ISODate(date)});
    var urmIds = db.clnCandidateAttendance.distinct('fkUserRoleMappingId',{batchMappingId:batchMappingId,activeFlag:1,date:ISODate(date)});
    var userList = db.clnCandidateAttendance.find({fkUserRoleMappingId:{$in:urmIds},date:ISODate(date)}).toArray();
    return {userList:userList};
}
});


db.system.js.save({
    "_id" : "saveCandidateAttendance",
    "value" : function (dataObj) {
        var userArray=[];
        userArray=dataObj.userList;
        for(index in userArray){
  
            userArray[index].batchMappingId=dataObj.batchMappingId;
            userArray[index].courseId=dataObj.courseId;
            userArray[index].companyId=dataObj.companyId;
            userArray[index].createdDate=dataObj.createdDate;
            userArray[index].updatedDate=dataObj.updatedDate;
            userArray[index].urmId=ObjectId(dataObj.urmId);
            userArray[index].crmId=ObjectId(dataObj.crmId);
            userArray[index].fkUserLoginId=ObjectId(userArray[index].fkUserLoginId);
            userArray[index].fkUserRoleMappingId=ObjectId(userArray[index].fkUserRoleMappingId);
            userArray[index].date=new Date(dataObj.date);
            userArray[index].activeFlag=1;
            
            db.clnCandidateAttendance.insert(userArray[index]);
        }
     return 'ok';
  }
});



db.system.js.save({
    "_id" : "updateCandidateAttendance",
    "value" : function (dataObj) {
        var menteeArrayForUpdate=[];
        menteeArrayForUpdate=dataObj.userList;
        for(key in menteeArrayForUpdate){
            menteeArrayForUpdate[key]._id = ObjectId(menteeArrayForUpdate[key]._id);
            menteeArrayForUpdate[key].fkUserRoleMappingId = ObjectId(menteeArrayForUpdate[key].fkUserRoleMappingId);
            menteeArrayForUpdate[key].fkUserLoginId = ObjectId(menteeArrayForUpdate[key].fkUserLoginId);
            menteeArrayForUpdate[key].crmId=ObjectId(menteeArrayForUpdate[key].crmId);
            menteeArrayForUpdate[key].urmId=ObjectId(menteeArrayForUpdate[key].urmId);
            menteeArrayForUpdate[key].date = new Date(menteeArrayForUpdate[key].date);
            
            db.clnCandidateAttendance.save(menteeArrayForUpdate[key]);
        }
     return 'ok';
  }
});