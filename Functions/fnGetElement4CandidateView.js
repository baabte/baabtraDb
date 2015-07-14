//fnGetElement4CandidateView

db.system.js.save({"_id" : "fnGetElement4CandidateView",
value:function (userLoginId, courseMappingId,syllabusObj) {

db.clnUserCourseMapping.update({_id:ObjectId(courseMappingId), fkUserLoginId:ObjectId(userLoginId), activeFlag:1},{$set: {lastViewedOrder:syllabusObj.order}});

response=fnGetCurrentCourseElement(userLoginId,courseMappingId,'');

return response;

}});