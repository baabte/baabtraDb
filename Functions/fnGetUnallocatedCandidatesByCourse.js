db.system.js.save({
_id:'fnGetUnallocatedCandidatesByCourse',
"value":function(companyId,courseId){
var orderFormList = db.clnTrainingRequest.find({companyId:ObjectId(companyId),"orderDetails.courseId":courseId,"orderDetails.userInfo.status":{$in:['Approved']}}).toArray();
return {orderFroms:orderFormList};
}});