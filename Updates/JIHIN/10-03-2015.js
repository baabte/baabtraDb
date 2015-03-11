db.system.js.save({_id:"fnLoadMenteesByCompanyId",value:function(e){var i=db.clnUserRoleMapping.distinct("fkUserLoginId",{fkRoleId:3,"profile.fkCompanyId":ObjectId(e),activeFlag:1}),n=db.clnUserDetails.find({fkUserLoginId:{$in:i}},{_id:0,fkUserLoginId:1,"profile.firstName":1,"profile.lastName":1}).toArray();return n}});

db.system.js.save({_id:"fnSaveFeedbackForm",value:function(e){e.validUntil=ISODate(e.validUntil),e.createdDate=ISODate(),e.updatedDate=ISODate(),e.crmId=ObjectId(e.rmId),e.urmId=ObjectId(e.rmId),delete e.rmId,e.companyId=ObjectId(e.companyId),e.targetList=[];var t=e.feedbackAbout;delete e.feedbackAbout;for(var d=0;d<t.feedbackOn.length;d++)e.feedbackTypeId=ObjectId(t.feedbackOn[d]),"Public"==e.formAccessTo&&(e.targetList=db.clnUserRoleMapping.distinct("_id",{fkCompanyId:e.companyId,activeFlag:1})),"course"==t.type&&(e.targetList=e.targetList.concat(db.clnUserCourseMapping.distinct("fkUserRoleMappingId",{fkCompanyId:e.companyId,fkCourseId:e.feedbackTypeId}))),e.targetList.length&&db.clnFeedbacks.insert(e);return e}});

db.system.js.save({_id:"fnViewFeedbackRequests",value:function(e,t){var d=db.clnFeedbacks.find({targetList:{$in:[ObjectId(e)]},companyId:ObjectId(t)},{title:1,description:1}).toArray();return d}});

db.system.js.save({_id:"fnLoadFeedbackRequestDetails",value:function(e,d){var a=db.clnFeedbacks.find({_id:ObjectId(d),companyId:ObjectId(e)}).toArray();return a}});

db.system.js.save({_id:"fnSaveUserFeedback",value:function(n,e){for(var o=db.clnFeedbacks.findOne({_id:ObjectId(n)}),t=0;t<o.questions.length;t++){var s=o.questions[t].data;for(optionsCount=1;optionsCount<s.length;optionsCount++)-1!=e[t].indexOf(s[optionsCount][0])&&(s[optionsCount][1]=s[optionsCount][1]+1)}return o.responseCount=o.responseCount+1,o.updatedDate=ISODate(),db.clnFeedbacks.save(o),"Success"}});




