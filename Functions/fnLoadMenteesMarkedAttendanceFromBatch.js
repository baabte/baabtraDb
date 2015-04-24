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
