/*
Modified by :Vineeth C
Created On : 21/02/2015
Purpose: For adding an extra argument for course filtering while course search
*/

/*
Modified by :Vineeth C
Created On : 28/02/2015
Purpose:To use fulltextSearch while searching courses
*/

/*
Modified by :Jihin
Created On : 22/05/2015
Purpose:add a projection "type" in course
*/

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
                courses = db.clnCourses.find({Domains:searchKey, _id:{$in:coursesArray}, companyId:{$in:providerArray}, draftFlag:1, activeFlag:1}, {Name:1, companyId:1, courseImg:1, courseDetails:1}).limit(12).sort({_id:-1}).toArray();
                break;
              case "Technologies":
                courses = db.clnCourses.find({Technologies:searchKey, _id:{$in:coursesArray}, companyId:{$in:providerArray}, draftFlag:1, activeFlag:1}, {Name:1, companyId:1, courseImg:1, courseDetails:1}).limit(12).sort({_id:-1}).toArray();
                break;
              case "Branches":
                courses = db.clnCourses.find({Branches:searchKey, _id:{$in:coursesArray}, companyId:{$in:providerArray}, draftFlag:1, activeFlag:1}, {Name:1, companyId:1, courseImg:1, courseDetails:1}).limit(12).sort({_id:-1}).toArray();
                break;
              case "Designation":
                courses = db.clnCourses.find({Designation:searchKey, _id:{$in:coursesArray}, companyId:{$in:providerArray}, draftFlag:1, activeFlag:1}, {Name:1, companyId:1, courseImg:1, courseDetails:1}).limit(12).sort({_id:-1}).toArray();
                break;
              case "Tags":
                courses = db.clnCourses.find({Tags:searchKey, _id:{$in:coursesArray}, companyId:{$in:providerArray}, draftFlag:1, activeFlag:1}, {Name:1, companyId:1, courseImg:1, courseDetails:1}).limit(12).sort({_id:-1}).toArray();
                break;
              case "Delivery":
                if (searchKey == "online") {
                    courses = db.clnCourses.find({'Delivery.online':true, _id:{$in:coursesArray}, companyId:{$in:providerArray}, draftFlag:1, activeFlag:1}, {Name:1, companyId:1, courseImg:1, courseDetails:1}).limit(12).sort({_id:-1}).toArray();
                } else {
                    courses = db.clnCourses.find({'Delivery.offline':true, _id:{$in:coursesArray}, companyId:{$in:providerArray}, draftFlag:1, activeFlag:1}, {Name:1, companyId:1, courseImg:1, courseDetails:1}).limit(12).sort({_id:-1}).toArray();
                }
                break;
              default:;
            }
        } else {
            courses = db.clnCourses.find({$text:{$search:searchKey}, _id:{$in:coursesArray}, companyId:{$in:providerArray}, draftFlag:1, activeFlag:1}, {Name:1, companyId:1, courseImg:1, courseDetails:1}).limit(12).sort({_id:-1}).toArray();
        }
    } else {
        if (type == "next") {
            courses = db.clnCourses.find({_id:{$in:coursesArray}, companyId:{$in:providerArray}, draftFlag:1, activeFlag:1, _id:{$lt:ObjectId(lastId)}}, {Name:1, companyId:1, courseImg:1, courseDetails:1}).limit(12).sort({_id:-1}).toArray();
        } else if (type == "prev") {
            courses = db.clnCourses.find({_id:{$in:coursesArray}, companyId:{$in:providerArray}, draftFlag:1, activeFlag:1, _id:{$gt:ObjectId(firstId)}}, {Name:1, companyId:1, courseImg:1, courseDetails:1}).limit(12).sort({_id:1}).toArray();
        } else {
            courses = db.clnCourses.find({_id:{$in:coursesArray}, companyId:{$in:providerArray}, draftFlag:1, activeFlag:1}, {Name:1, companyId:1, courseImg:1, courseDetails:1}).limit(12).sort({_id:-1}).toArray();
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
