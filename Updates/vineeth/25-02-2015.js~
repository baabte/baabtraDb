db.clnCourses.ensureIndex(//for adding text index
                           {
                             Name: "text",
                             Technologies:"text",
                             Domains:"text",
                             Tags:"text"
                           }
                         )

db.system.js.save({_id: "fun_load_publishedCourses",
		value: function (companyId,searchKey,searchRange) 
{
if (searchKey!=''){
 courses= db.clnCourses.find({$text:{$search:searchKey},
    companyId:ObjectId(companyId),
    draftFlag:1, 
    activeFlag:1},
      {Name:1,courseImg:1,Description:1}).skip(searchRange).limit(12).toArray();
      
 courseCount=db.clnCourses.find({$text:{$search:searchKey},
    companyId:ObjectId(companyId),
    draftFlag:1, 
    activeFlag:1},
      {Name:1,courseImg:1,Description:1}).skip(searchRange).limit(13). count(true);      
 }else{
  courses= db.clnCourses.find({
    companyId:ObjectId(companyId),
    draftFlag:1, 
    activeFlag:1},
      {Name:1,courseImg:1,Description:1}).skip(searchRange).limit(12).toArray();
      
 courseCount=db.clnCourses.find({
    companyId:ObjectId(companyId),
    draftFlag:1, 
    activeFlag:1},
      {Name:1,courseImg:1,Description:1}).skip(searchRange).limit(13). count(true);      
 }   
    return {courses:courses,courseCount:courseCount}
}});


