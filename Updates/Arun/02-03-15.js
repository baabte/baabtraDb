db.system.js.save({_id: "fnfetchCourseList",
      value: function (courseFetchData) {
    var companyId=ObjectId(courseFetchData.fkcompanyId);
    var courselist = db.clnCourses.find({companyId:companyId,draftFlag:1, activeFlag:1}, {_id:1, Name:1}).toArray();
    return courselist;
}});