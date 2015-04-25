db.system.js.save({
    "_id" : "fnLoadAllBatches4Report",
    "value" : function(companyId){
	return db.clnCourseBatchMapping.find({fkCompanyId:ObjectId(companyId),activeFlag:1},{_id:1,batchName:1,fkCourseId:1,courseName:1}).toArray();
}
});

db.system.js.save({
    "_id" : "fnLoadBatchAttReport",
    "value" : function (searchObj) {
    var matchObj = {};
    if (searchObj.date) {
        if (searchObj.date.fromDate) {
            if (!matchObj.date) {
                matchObj.date = {};
            }
            matchObj.date.$gt = ISODate(searchObj.date.fromDate);
        }
        if (searchObj.date.toDate) {
            if (!matchObj.date) {
                matchObj.date = {};
            }
            matchObj.date.$lt = ISODate(searchObj.date.toDate);
            matchObj.batchMappingId = searchObj.selectedBatch[0].batchMappingId;
        }
    }
    var report = db.clnCandidateAttendance.aggregate([{$match:matchObj}, {$group:{_id:{status:"$status", userFname:"$profile.firstName",uid:"$fkUserRoleMappingId", userLname:"$profile.lastName"},count:{$sum:1}}}, ]).toArray();
    var totalCount = db.clnCandidateAttendance.aggregate([{$match:matchObj}, {$group:{_id:{batchMappingId:"$batchMappingId", date:"$date"}, count:{$sum:1}}}, ]).toArray();
    return {report:report, totalCount:totalCount};
}
});

