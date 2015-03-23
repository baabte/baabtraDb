/*
Created by : Jihin
Date : 18-3-2015
purpose : For add departments to department collection
*/

db.system.js.save({_id:'fnAddDepartment',
value:function(departmentObject, companyId, rmId) {
    var department = {};
    var departments = departmentObject[Object.keys(departmentObject)[0]];
    for(var deptCount=0; departments.length > deptCount; deptCount++){
            if(departments[deptCount].deptHeadrmId != null){
                departments[deptCount].deptHeadrmId = ObjectId(departments[deptCount].deptHeadrmId);
            }
        }
    departmentObject[Object.keys(departmentObject)[0]] = departments;
    department.departments = departmentObject;
    department.companyId = ObjectId(companyId);
    department.createdDate = ISODate();
    department.updatedDate = ISODate();
    department.urmId = ObjectId(rmId);
    department.crmId = ObjectId(rmId);
    department.activeFlag = 1;
    db.clnDepartments.insert(department);
    return departmentObject[Object.keys(departmentObject)[0]].length;
}});
