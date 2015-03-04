
db.system.js.save({
       "_id" : "fun_load_publishedCourses",
       "value" : function (companyId)
{
courses=db.clnCourses.find({companyId:ObjectId(companyId),draftFlag:1,activeFlag:1}).toArray();
return courses;}
});