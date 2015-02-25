/*
Modified by :Vineeth C
Created On : 21/02/2015
Purpose: For adding an extra argument for course filtering while course search
*/
db.system.js.save({_id: "fun_load_publishedCourses",
		value: function (companyId,searchKey) 
{
    courses = db.clnCourses.find({companyId:ObjectId(companyId),Name:{$regex:searchKey,$options:"$i"},draftFlag:1, activeFlag:1},{Name:1,courseImg:1,Description:1}).toArray();
    return courses;
}});
