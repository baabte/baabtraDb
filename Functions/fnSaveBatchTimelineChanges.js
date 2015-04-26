/*
Created by : Jihin
Date : 23-04-2015
purpose : For update batch timeline details
*/

db.system.js.save({_id: "fnSaveBatchTimelineChanges",
	value: function(coureBatchId, courseTimeline) {
	db.clnCourseBatchMapping.update({ _id: ObjectId(coureBatchId)},{ $set:{courseTimeline:courseTimeline}});
	return {result:"Success"};
}});
