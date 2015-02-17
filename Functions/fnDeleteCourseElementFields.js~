/*
Created by : Jihin
Created On : 04/02/2015
Purpose : For delete course element from course timeline
*/

db.system.js.save({_id: "fnDeleteCourseElementFields",
		value:function(elementId, manageType, urmId) {
    manageType.updatedDate =Date();
    manageType.urmId = urmId;
    db.clnCourseElementFields.update({_id:elementId},{$set:manageType});
    return db.eval("fnGetCourseElementFields()");
}});
