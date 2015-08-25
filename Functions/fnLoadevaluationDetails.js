
db.system.js.save({_id: "fnLoadevaluationDetails",
	value:function (courseMappingId,orders) {
    var details = db.clnUserCourseMapping.findOne({"_id":ObjectId(courseMappingId)});
    var res = elementOrder.split(".");
    var result = details.courseTimeline[res[0]][res[1]][res[2]];
    return result;
}
});

