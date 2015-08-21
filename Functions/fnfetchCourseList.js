//fnfetchCourseList
db.system.js.save({_id: "fnfetchCourseList",
      value: function (courseFetchData) {
    var companyId = ObjectId(courseFetchData.fkcompanyId);

    if (courseFetchData.type != undefined) {
        var type = courseFetchData.type:courseFetchData.type?'all';
    } else {
        var type = "all";
    }

    var providerArray = db.clnReseller.distinct("providers.companyId", {fkCompanyId:companyId});
    if (providerArray == null) {
        providerArray = [];
    }
    providerArray.push(companyId);

    var providerCourses = db.clnReseller.findOne({fkCompanyId:companyId}, {_id:0, 'providers.courses':1});
    var coursesArray = db.clnCourses.distinct("_id", {companyId:companyId});
    if (providerCourses != null) {
        for (var index in providerCourses.providers) {
            providerCourses.providers[index].courses;
            coursesArray = providerCourses.providers[index].courses.concat(coursesArray);
        }
    }
    if (type == "all") {
        var courselist = db.clnCourses.find({_id:{$in:coursesArray}, companyId:{$in:providerArray}, draftFlag:1, activeFlag:1}, {_id:1, Name:1, totalMark:1}).toArray();
    } else {
        var courselist = db.clnCourses.find({_id:{$in:coursesArray}, companyId:{$in:providerArray}, type:type, draftFlag:1, activeFlag:1}, {_id:1, Name:1, totalMark:1}).toArray();
    }
    return courselist;
}});
