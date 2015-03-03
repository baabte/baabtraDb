
db.system.js.save({_id: "fnGetCourseDetailsById",
      value: function(courseId) {
    var courseDetails = db.clnCourses.findOne({_id:courseId});
    cmp_id = courseDetails.companyId;
    var companyDetails = db.clnCompany.findOne({_id:cmp_id},{companyName:1,companyLogo:1});
    return {courseDetails:courseDetails,companyDetails:companyDetails};
}});
