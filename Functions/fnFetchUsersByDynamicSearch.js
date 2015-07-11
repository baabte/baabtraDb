db.system.js.save({
    "_id" : "fnFetchUsersByDynamicSearch",
    "value" : function (companyId, firstId, lastId, type,  searchKey) {
	var userloginIds = db.clnUserRoleMapping.distinct("fkUserLoginId", {fkRoleId:3, 'profile.fkCompanyId':ObjectId(companyId), activeFlag:1});
        var result = {};
        var conditions = {fkUserLoginId:{$in:userloginIds}, activeFlag:1};
        var sort = {_id:-1};
        var limitSort = "";
        if(type == "next"){
            conditions._id = {$lt:ObjectId(lastId)};
        }
        else if(type == "prev"){
            sort = {_id:1};
            conditions._id = {$gt:ObjectId(firstId)};
        }
        if(searchKey != ""){
            for(var key in searchKey){
                if(searchKey[key] != "")
                conditions['profile.'+key] = {$regex:new RegExp(searchKey[key],'i')}; 
            }
        }
        result.conditions = conditions;
        result["users"] = db.clnUserDetails.find(conditions, {fkUserLoginId:1, _id:1, userName:1, profile:1}).limit(12).sort(sort).toArray();
        if(result["users"].length){
            result["firstUserId"] = result["users"][0]._id.valueOf();
            result["lastUserId"] = result["users"][result["users"].length - 1]._id.valueOf();
        }
        else{
            result["firstUserId"] = firstId;
            result["lastUserId"] = lastId;
        }
            return result;
}});

