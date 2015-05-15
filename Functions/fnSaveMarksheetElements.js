/*
Created by Lijin
Created Date:13-5-2015
Purpose: for updating marksheet elements

*/
db.system.js.save({_id:'fnSaveMarksheetElements',value:function(courseId,markSheetElements){
  db.clnCourses.update({_id:ObjectId(courseId)},{$set:{markSheetElements:markSheetElements}});
  return 'ok'; 
}});