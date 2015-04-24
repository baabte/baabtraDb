db.system.js.save({
    "_id" : "fnLoadAllBatches4Report",
    "value" : function(companyId){
	return db.clnCourseBatchMapping.find({fkCompanyId:ObjectId(companyId),activeFlag:1},{_id:1,batchName:1,fkCourseId:1,courseName:1}).toArray();
}
});
