db.system.js.save({_id:"fnSaveUserFeedback",value:function(e,s){var n=db.clnFeedbacks.findOne({_id:ObjectId(e)});void 0==n.userResponse&&(n.userResponse=[]),s.userResponse.rmId=ObjectId(s.userResponse.rmId),n.userResponse.push(s.userResponse);for(var o=0;o<n.questions.length;o++){var t=n.questions[o].data;for(optionsCount=1;optionsCount<t.length;optionsCount++)-1!=s.responseObject[o].indexOf(t[optionsCount][0])&&(t[optionsCount][1]=t[optionsCount][1]+1)}return n.responseCount=n.responseCount+1,n.updatedDate=ISODate(),db.clnFeedbacks.save(n),"Success"}});

db.system.js.save({_id:"fnLoadFeedbackRequestDetails",value:function(e,d,s){var n=db.clnFeedbacks.findOne({_id:ObjectId(d),companyId:ObjectId(e),userResponse:{$elemMatch:{rmId:ObjectId(s)}}},{questions:1,userResponse:1});return null==n&&(n=db.clnFeedbacks.findOne({_id:ObjectId(d),companyId:ObjectId(e)},{userResponse:0})),n}});

db.system.js.save({_id:"fnViewFeedbackRequests",value:function(e,t){var d={},a=db.clnFeedbacks.find({targetList:{$in:[ObjectId(e)]},companyId:ObjectId(t),userResponse:{$not:{$elemMatch:{rmId:ObjectId(e)}}},validUntil:{$gt:ISODate()}},{title:1,description:1,createdDate:1}).sort({createdDate:-1}).toArray(),c=db.clnFeedbacks.find({targetList:{$in:[ObjectId(e)]},companyId:ObjectId(t),userResponse:{$elemMatch:{rmId:ObjectId(e)}}},{title:1,description:1,createdDate:1}).sort({createdDate:-1}).toArray();return d.pendingFeedback=a,d.submitedFeedback=c,d}});
