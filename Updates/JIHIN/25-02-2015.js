db.system.js.save({_id:"fnInsertBranches",value:function(b,a){if(db.clnBranches.find({companyId:b}).count()){db.clnBranches.update({companyId:b},{$set:{branches:a}})}else{db.clnBranches.insert({companyId:b,branches:a})}return db.clnBranches.find({companyId:b}).toArray()}});

db.system.js.save({_id:"fnUploadProfilePic",value:function(b,a){db.clnUserRoleMapping.update({_id:a},{$set:{avatar:b,urmId:a,updatedDate:Date()}});db.clnActiveUserData.update({roleMappingId:a},{$set:{"roleMappingObj.avatar":b,urmId:a,updatedDate:Date()}});return"Profile Picture Changed Successfuly"}});

db.system.js.save({_id:"fnGetCourseDetailsById",value:function(n){var e=db.clnCourses.findOne({_id:n});cmp_id=e.companyId;var a=db.clnCompany.findOne({_id:cmp_id},{companyName:1,companyLogo:1});return{courseDetails:e,companyDetails:a}}});

db.system.js.save({_id:"fnInsertNotificationDetails",value:function(e,t,i,a,n){var o={};o.userRoleMappingId="",o.notification=[{type:i,typeId:t,date:ISODate(),message:a}],o.createdDate=ISODate(),o.updatedDate=ISODate(),o.crmId=n,o.urmId=n,o.activeFlag=1;var d="";if(null!=e.length)for(var l=0;l<e.length;l++)o.userRoleMappingId=e[l],n.str!=e[l].valueOf()&&(d=db.clnNotification.findOne({userRoleMappingId:o.userRoleMappingId}),null==d?db.clnNotification.insert(o):db.clnNotification.update({userRoleMappingId:o.userRoleMappingId},{$push:{notification:o.notification[0]}}));return"Success"}});


db.system.js.save({_id:"fnViewFeedbackRequests",value:function(e,t){var d={},a=db.clnFeedbacks.find({targetList:{$in:[ObjectId(e)]},companyId:ObjectId(t),userResponse:{$not:{$elemMatch:{rmId:ObjectId(e)}}}},{title:1,description:1,createdDate:1}).sort({createdDate:-1}).toArray(),c=db.clnFeedbacks.find({targetList:{$in:[ObjectId(e)]},companyId:ObjectId(t),userResponse:{$elemMatch:{rmId:ObjectId(e)}}},{title:1,description:1,createdDate:1}).sort({createdDate:-1}).toArray();return d.pendingFeedback=a,d.submitedFeedback=c,d}});
