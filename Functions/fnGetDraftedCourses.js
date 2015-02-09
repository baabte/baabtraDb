/*
Created by : Jihin
Created On : 04/02/2015
Purpose : For load drafted courses
*/


db.system.js.save({_id: "fnGetDraftedCourses",
		value: function(cmp_id) {
    return db.clnCourses.find({companyId:cmp_id,draftFlag:0,activeFlag:1},{Name:1, Image:1, Description:1}).toArray();
}});
