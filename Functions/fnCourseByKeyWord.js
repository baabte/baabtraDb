db.system.js.save({_id: "fnCourseByKeyWord",
		value: function (companyId, searchKey) {
    var courses = {};
    var CourseByTechnologies = db.clnCourses.find({Technologies:{$in:searchKey.Technologies}, companyId:ObjectId(companyId), draftFlag:1, activeFlag:1},
                               {Name:1,courseImg:1,courseDetails:1,Technologies:1}).limit(5).toArray();
        courses.Technologies = CourseByTechnologies; 
   var CourseByTags = db.clnCourses.find({Tags:{$in:searchKey.Tags}, companyId:ObjectId(companyId), draftFlag:1, activeFlag:1},
                               {Name:1,courseImg:1,courseDetails:1,Tags:1}).limit(5).toArray();
        courses.Tags = CourseByTags;
   var CourseByDomains  = db.clnCourses.find({Domains:{$in:searchKey.Domains}, companyId:ObjectId(companyId), draftFlag:1, activeFlag:1},
                               {Name:1,courseImg:1,courseDetails:1,Domains:1}).limit(5).toArray();
        courses.Domains = CourseByDomains;
             
    return {courses:courses};
}});
