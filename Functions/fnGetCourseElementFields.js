/*
Created by :JIHIN
Created On : 12/02/2015
Purpose: For Geting course element fields
*/

db.system.js.save({_id: "fnGetCourseElementFields",
		value: function() {
    return db.clnCourseElementFields.find({activeFlag:1}).toArray()
}});
