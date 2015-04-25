/*
Created by : Jihin
Date : 23-04-2015
purpose : For update batch timeline details
*/

db.system.js.save({_id: "fnLoadCoureBatchByBatchId",
	value:function(coureBatchId, companyId) {
	return db.clnCourseBatchMapping.findOne({_id:ObjectId(coureBatchId),fkCompanyId:ObjectId(companyId)});
}});
