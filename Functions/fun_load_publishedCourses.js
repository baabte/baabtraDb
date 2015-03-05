/*
Modified by :Vineeth C
Created On : 21/02/2015
Purpose: For adding an extra argument for course filtering while course search
*/

/*
Modified by :Vineeth C
Created On : 28/02/2015
Purpose:To use fulltextSearch while searching courses
*/

db.system.js.save({_id: "fun_load_publishedCourses",
		value: fun_load_publishedCourses
function (companyId,searchKey,searchRange) {
if (searchKey!=''){
 courses= db.clnCourses.find({$text:{$search:searchKey},
    companyId:ObjectId(companyId),
    draftFlag:1, 
    activeFlag:1},
      {Name:1,courseImg:1,courseDetails:1}).skip(searchRange).limit(12).toArray();
      
 courseCount=db.clnCourses.find({$text:{$search:searchKey},
    companyId:ObjectId(companyId),
    draftFlag:1, 
    activeFlag:1},
      {Name:1,courseImg:1,courseDetails:1}).skip(searchRange).limit(13). count(true);      
 }else{
  courses= db.clnCourses.find({
    companyId:ObjectId(companyId),
    draftFlag:1, 
    activeFlag:1},
      {Name:1,courseImg:1,courseDetails:1}).skip(searchRange).limit(12).toArray();
      
 courseCount=db.clnCourses.find({
    companyId:ObjectId(companyId),
    draftFlag:1, 
    activeFlag:1},
      {Name:1,courseImg:1,courseDetails:1}).skip(searchRange).limit(13). count(true);      
 }   
    return {courses:courses,courseCount:courseCount}
}});



