db.system.js.save({_id: "fnGetDraftedCourses",
		value: function(cmp_id) {
    return db.clnCourses.find({draftFlag:0,activeFlag:1},{Name:1, Image:1, Description:1}).toArray();
}});
