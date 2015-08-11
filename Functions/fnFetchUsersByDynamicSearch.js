db.system.js.save({
    "_id" : "fnFetchUsersByDynamicSearch",
    "value" : function (companyId, firstId, lastId, type, searchKey) {
    var courseCondition = {fkCompanyId:ObjectId(companyId), activeFlag:1};
    if (searchKey.coursesSelected) {
        for (var course in searchKey.coursesSelected) {
            searchKey.coursesSelected[course] = ObjectId(searchKey.coursesSelected[course]);
        }
        if (searchKey.coursesSelected.length) {
            courseCondition.fkCourseId = {$in:searchKey.coursesSelected};
        }
        delete searchKey.coursesSelected;
    }
    var userloginIds = db.clnUserCourseMapping.distinct("fkUserLoginId", courseCondition);
    var result = {};
    var temp = {};
    var conditions = {fkUserLoginId:{$in:userloginIds}, activeFlag:1};
    var sort = {_id:1};
    if (type == "next") {
        conditions._id = {$gt:ObjectId(lastId)};
    } else if (type == "prev") {
        sort = {_id:-1};
        conditions._id = {$lt:ObjectId(firstId)};
    }

    if (searchKey.status){
        var status=searchKey.status;
        delete searchKey.status;
        for(var key in status){
            if(status[key]!=""){
            conditions["status." + key]=status[key]
            }
        }
    }
    if (Object.keySet(searchKey).length) {
        for (var key in searchKey) {
            if (typeof searchKey[key] != "string") {
                for (var reg in searchKey[key]) {
                    if (searchKey[key][reg] != "") {
                        conditions["profile." + reg] = {$regex:new RegExp(searchKey[key][reg], "i")};
                    }
                }
            } else if (searchKey[key] != "") {
                conditions[key] = {$regex:new RegExp(searchKey[key], "i")};
            }
        }
    }
    result.users = db.clnUserDetails.find(conditions, {fkUserLoginId:1, _id:1, userName:1, profile:1}).sort(sort).limit(12).toArray();
    if (result.users.length) {
        result.firstUserId = result.users[0]._id.valueOf();
        result.lastUserId = result.users[result.users.length - 1]._id.valueOf();
    } else {
        result.firstUserId = firstId;
        result.lastUserId = lastId;
    }
    return result;
}});

