/*
Created by : Jihin
Date : 18-3-2015
purpose : Load Departments
*/

db.system.js.save({_id:'fnLoadDepartments',
value:function(companyId, branchId) {
    var department = db.clnDepartments.findOne({companyId: ObjectId(companyId)});
    var returnObject = "";
    if(department== null){
        returnObject = null;
    }
    else{
        returnObject = department.departments[branchId];
    }
    return returnObject;
}});
