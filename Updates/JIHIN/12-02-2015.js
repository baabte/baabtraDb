db.system.js.save({_id:"fnGetCourseElementFields",value:function(){return db.clnCourseElementFields.find({activeFlag:1}).toArray()}});

db.system.js.save({_id:"fnDeleteCourseElementFields",value:function(elementId,manageType,urmId){manageType.updatedDate=Date();manageType.urmId=urmId;db.clnCourseElementFields.update({_id:elementId},{$set:manageType});return db.eval("fnGetCourseElementFields()")}});

db.system.js.save({_id:"fnSaveCourseElementFields",value:function(element){db.clnCourseElementFields.save(element);var response={};if(element._id==undefined){response.msg="Course Element Field Added Successfully"}else{response.msg="Course Element Field Updated Successfully"}response.data=db.eval("fnGetCourseElementFields()");return response}});




