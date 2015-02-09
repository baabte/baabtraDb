db.system.js.save({_id:"fnEditCourseElement",value:function(g,a,f,d,c){var b="courseTimeline."+f+"."+a;var e={};e[b]=d;db.clnCourses.update({_id:g},{$set:e});return db.clnCourses.find({_id:g}).toArray()}});

db.system.js.save({_id:"fnRemoveCourseElement",value:function(f,d,h,g,c){var j="courseTimeline."+h+"."+d;var e={};e[j]=g;db.clnCourses.update({_id:f},{$pop:e});var i=db.clnCourses.findOne({_id:f});if(!i.courseTimeline[h][d].length){b=i.courseTimeline[h][d];var k={};k[j]=1;db.clnCourses.update({_id:f},{$unset:k});i=db.clnCourses.findOne({_id:f});if(Object.keys(i.courseTimeline[h]).length==0){k={};k["courseTimeline."+h]=1;db.clnCourses.update({_id:f},{$unset:k});b=k}}return"courseTimeline."+h}});

db.system.js.save({_id:"fnGetDraftedCourses",value:function(a){return db.clnCourses.find({draftFlag:0,activeFlag:1},{Name:1,Image:1,Description:1}).toArray()}});

