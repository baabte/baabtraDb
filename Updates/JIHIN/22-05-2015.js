db.system.js.save({_id: "fun_load_publishedCourses",
		value: function (companyId, searchKey, lastId, type, firstId) {
    var providerArray = db.clnReseller.distinct("providers.companyId", {fkCompanyId:ObjectId(companyId)});
    if (providerArray == null) {
        providerArray = [];
    }
    providerArray.push(ObjectId(companyId));
    var providerCourses = db.clnReseller.findOne({fkCompanyId:ObjectId(companyId)}, {_id:0, 'providers.courses':1});
    var coursesArray = db.clnCourses.distinct("_id", {companyId:ObjectId(companyId)});
    if (providerCourses != null) {
        for (var index in providerCourses.providers) {
            providerCourses.providers[index].courses;
            coursesArray = providerCourses.providers[index].courses.concat(coursesArray);
        }
    }
    if (searchKey != "") {
        if (type != "") {
            switch (type) {
              case "Domains":
                courses = db.clnCourses.find({Domains:searchKey, _id:{$in:coursesArray}, companyId:{$in:providerArray}, draftFlag:1, activeFlag:1}, {Name:1, companyId:1, courseImg:1, courseDetails:1, type:1}).limit(12).sort({_id:-1}).toArray();
                break;
              case "Technologies":
                courses = db.clnCourses.find({Technologies:searchKey, _id:{$in:coursesArray}, companyId:{$in:providerArray}, draftFlag:1, activeFlag:1}, {Name:1, companyId:1, courseImg:1, courseDetails:1, type:1}).limit(12).sort({_id:-1}).toArray();
                break;
              case "Branches":
                courses = db.clnCourses.find({Branches:searchKey, _id:{$in:coursesArray}, companyId:{$in:providerArray}, draftFlag:1, activeFlag:1}, {Name:1, companyId:1, courseImg:1, courseDetails:1, type:1}).limit(12).sort({_id:-1}).toArray();
                break;
              case "Designation":
                courses = db.clnCourses.find({Designation:searchKey, _id:{$in:coursesArray}, companyId:{$in:providerArray}, draftFlag:1, activeFlag:1}, {Name:1, companyId:1, courseImg:1, courseDetails:1, type:1}).limit(12).sort({_id:-1}).toArray();
                break;
              case "Tags":
                courses = db.clnCourses.find({Tags:searchKey, _id:{$in:coursesArray}, companyId:{$in:providerArray}, draftFlag:1, activeFlag:1}, {Name:1, companyId:1, courseImg:1, courseDetails:1, type:1}).limit(12).sort({_id:-1}).toArray();
                break;
              case "Delivery":
                if (searchKey == "online") {
                    courses = db.clnCourses.find({'Delivery.online':true, _id:{$in:coursesArray}, companyId:{$in:providerArray}, draftFlag:1, activeFlag:1}, {Name:1, companyId:1, courseImg:1, courseDetails:1, type:1}).limit(12).sort({_id:-1}).toArray();
                } else {
                    courses = db.clnCourses.find({'Delivery.offline':true, _id:{$in:coursesArray}, companyId:{$in:providerArray}, draftFlag:1, activeFlag:1}, {Name:1, companyId:1, courseImg:1, courseDetails:1, type:1}).limit(12).sort({_id:-1}).toArray();
                }
                break;
              default:;
            }
        } else {
            courses = db.clnCourses.find({$text:{$search:searchKey}, _id:{$in:coursesArray}, companyId:{$in:providerArray}, draftFlag:1, activeFlag:1}, {Name:1, companyId:1, courseImg:1, courseDetails:1, type:1}).limit(12).sort({_id:-1}).toArray();
        }
    } else {
        if (type == "next") {
            courses = db.clnCourses.find({_id:{$in:coursesArray}, companyId:{$in:providerArray}, draftFlag:1, activeFlag:1, _id:{$lt:ObjectId(lastId)}}, {Name:1, companyId:1, courseImg:1, courseDetails:1, type:1}).limit(12).sort({_id:-1}).toArray();
        } else if (type == "prev") {
            courses = db.clnCourses.find({_id:{$in:coursesArray}, companyId:{$in:providerArray}, draftFlag:1, activeFlag:1, _id:{$gt:ObjectId(firstId)}}, {Name:1, companyId:1, courseImg:1, courseDetails:1, type:1}).limit(12).sort({_id:1}).toArray();
        } else {
            courses = db.clnCourses.find({_id:{$in:coursesArray}, companyId:{$in:providerArray}, draftFlag:1, activeFlag:1}, {Name:1, companyId:1, courseImg:1, courseDetails:1, type:1}).limit(12).sort({_id:-1}).toArray();
        }
    }
    if (courses.length != 0) {
        if (type == "prev") {
            lastItem = courses[0]._id;
            firstItem = courses[courses.length - 1]._id;
            courses.reverse();
        } else {
            lastItem = courses[courses.length - 1]._id;
            firstItem = courses[0]._id;
        }
    } else {
        if (type == "prev") {
            firstItem = ObjectId(firstId);
            lastItem = ObjectId(lastId);
        } else if (type == "next") {
            firstItem = ObjectId(lastId);
            lastItem = ObjectId(firstId);
        } else {
            firstItem = [];
            lastItem = [];
        }
    }
    return {courses:courses, lastId:lastItem, firstId:firstItem, courseLength:courses.length};
}});

db.system.js.save({_id: "fnDeleteDraftedCourse",
		value: function (manageType, courseId, urmId, courseType, companyId) {
    if (manageType.activeFlag == 0) {
        var course = db.clnCourses.find({_id:courseId}).toArray();
        db.clnArchiveCourses.insert(course);
        db.clnCourses.remove({_id:courseId});
        db.clnArchiveCourses.update({_id:courseId}, {$set:{updatedDate:Date(), urmId:urmId}});
    } else if (manageType.activeFlag == 1) {
        var course = db.clnArchiveCourses.find({_id:courseId}).toArray();
        db.clnCourses.insert(course);
        db.clnArchiveCourses.remove({_id:courseId});
        db.clnCourses.update({_id:courseId}, {$set:{updatedDate:Date(), urmId:urmId}});
    }
    if (courseType == "Draft") {
        return fnGetDraftedCourses(companyId);
    } else if (courseType == "Publish") {
        return fun_load_publishedCourses(companyId.valueOf(), "", "", "", "");
    }
}});
