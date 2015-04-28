db.system.js.save({_id:"fnAddCourseDetails",value:function(e,s){if(""==s){var s=new ObjectId;e._id=s}else e._id=s;return db.clnCourses.save(e),s}});

db.system.js.save({_id:"fnEditCourseElement",value:function(e,n,t,r){var l=r.index,i=r.element,o="courseTimeline."+t+"."+n,s={};s[o]=i;var a=db.clnCourses.find({_id:e}).toArray(),u=a[0].courseTimeline[t][n][l].order,m=0,d=0,v=0,c=a[0].courseTimeline[t][n],k=0;a[0].totalMark&&(m=a[0].totalMark);for(index in c)for(k=0;k<c[index].elements.length;k++)null!=c[index].elements[k]&&("question-viewer"==c[index].elements[k].type||"question-group-viewer"==c[index].elements[k].type)&&(d+=c[index].elements[k].value.mark.totalMark);for(k=0;k<i.elements.length;k++)null!=c[index].elements[k]&&("question-viewer"==i.elements[k].type||"question-group-viewer"==i.elements[k].type)&&(v+=i.elements[k].value.mark.totalMark);var x=0;return a[0].courseTimeline[t].totalMark&&(x=a[0].courseTimeline[t].totalMark),a[0].courseTimeline[t][n][l]=i,a[0].courseTimeline[t][n][l].order=u,a[0].totalMark=m+(v-d),a[0].courseTimeline[t].totalMark=x+(v-d),db.clnCourses.save(a[0]),a}});

db.system.js.save({_id:"fnSaveBatchTimelineChanges",value:function(e,s){return db.clnCourseBatchMapping.update({_id:ObjectId(e)},{$set:{courseTimeline:s}}),{result:"Success"}}});

db.system.js.save({_id:"fnLoadCoureBatchByBatchId",value:function(d,e){return db.clnCourseBatchMapping.findOne({_id:ObjectId(d),fkCompanyId:ObjectId(e)})}});

db.system.js.save({_id:"fnLoadInterviewQuestionBank",value:function(){return db.clnInterviewQuestionBank.find().limit(10).toArray()}});

db.system.js.save({_id:"fnLoadUserCourseDetails",value:function(e,r){for(var a=0;a<e.length;a++)e[a]=ObjectId(e[a]);var s=db.clnUserCourseMapping.find({fkUserRoleMappingId:{$in:e},fkCourseId:ObjectId(r),activeFlag:1}).toArray();return s}});
