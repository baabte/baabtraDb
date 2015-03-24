db.system.js.save({_id: "fnLoadExistingCoursesUnderBatch",
		value: function (id) 
{
  courses=db.clnBatches.find({_id:ObjectId(id)}
    ).sort({_id:-1}).toArray();
    return courses;

}});

