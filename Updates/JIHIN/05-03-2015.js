db.system.js.save({_id:"fnCourseByKeyWord",value:function(a,f){var b={};var e=db.clnCourses.find({Technologies:{$in:f.Technologies},companyId:ObjectId(a),draftFlag:1,activeFlag:1},{Name:1,courseImg:1,courseDetails:1,Technologies:1}).limit(5).toArray();b.Technologies=e;var c=db.clnCourses.find({Tags:{$in:f.Tags},companyId:ObjectId(a),draftFlag:1,activeFlag:1},{Name:1,courseImg:1,courseDetails:1,Tags:1}).limit(5).toArray();b.Tags=c;var d=db.clnCourses.find({Domains:{$in:f.Domains},companyId:ObjectId(a),draftFlag:1,activeFlag:1},{Name:1,courseImg:1,courseDetails:1,Domains:1}).limit(5).toArray();b.Domains=d;return{courses:b}}});
