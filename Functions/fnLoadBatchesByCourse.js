db.system.js.save({
_id:'fnLoadBatchesByCourse',
"value":function(companyId,courseId){
   var batchList = db.clnCourseBatchMapping.find({fkCourseId:ObjectId(courseId),fkCompanyId:ObjectId(companyId)},{courseTimeline:0,markSheetElements:0,elementOrder:0,syllabus:0}).toArray();
   return batchList;
}});