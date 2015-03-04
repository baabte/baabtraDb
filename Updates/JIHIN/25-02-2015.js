db.system.js.save({_id:"fnInsertBranches",value:function(b,a){if(db.clnBranches.find({companyId:b}).count()){db.clnBranches.update({companyId:b},{$set:{branches:a}})}else{db.clnBranches.insert({companyId:b,branches:a})}return db.clnBranches.find({companyId:b}).toArray()}});

db.system.js.save({_id:"fnUploadProfilePic",value:function(b,a){db.clnUserRoleMapping.update({_id:a},{$set:{avatar:b,urmId:a,updatedDate:Date()}});db.clnActiveUserData.update({roleMappingId:a},{$set:{"roleMappingObj.avatar":b,urmId:a,updatedDate:Date()}});return"Profile Picture Changed Successfuly"}});

db.system.js.save({_id:"fnGetCourseDetailsById",value:function(n){var e=db.clnCourses.findOne({_id:n});cmp_id=e.companyId;var a=db.clnCompany.findOne({_id:cmp_id},{companyName:1,companyLogo:1});return{courseDetails:e,companyDetails:a}}});
