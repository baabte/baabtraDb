/*
Created by : Jihin
Date : 18-3-2015
purpose : For add departments to department collection
*/

db.system.js.save({_id:'fnAddDepartment',
value:function(departmentObject, companyId, rmId) {
    var departmentsDetails = db.clnDepartments.findOne({companyId:ObjectId(companyId)});
    var departments = "";
    if( departmentsDetails != null ){
        departmentsDetails.departments[Object.keys(departmentObject)[0]] = departmentObject[Object.keys(departmentObject)[0]];
        departmentsDetails.updatedDate = ISODate();
        departmentsDetails.urmId = ObjectId(rmId);
        departments = departmentsDetails.departments[Object.keys(departmentObject)[0]];
        for(var deptCount=0; departments.length > deptCount; deptCount++){
            if(departments[deptCount].deptHeadrmId != null){
                if(departments[deptCount].departmentId == undefined){
                    departments[deptCount].departmentId = new ObjectId();
                }
                else{
                    departments[deptCount].departmentId = ObjectId(departments[deptCount].departmentId);
                }
               departments[deptCount].deptHeadrmId[0].roleMappingId = ObjectId(departments[deptCount].deptHeadrmId[0].roleMappingId);
            
        }
        }
        departmentsDetails.departments[Object.keys(departmentObject)[0]] = departments;
        db.clnDepartments.save(departmentsDetails);
        
    }
    else{
        var department = {};
    var departments = departmentObject[Object.keys(departmentObject)[0]];
    for(var deptCount=0; departments.length > deptCount; deptCount++){
            departments[deptCount].departmentId = new ObjectId();
            if(departments[deptCount].deptHeadrmId != null){
                departments[deptCount].deptHeadrmId[0].roleMappingId = ObjectId(departments[deptCount].deptHeadrmId[0].roleMappingId);
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
    }
    var department = db.clnDepartments.findOne({companyId: ObjectId(companyId)});
    
    return department.departments[Object.keys(departmentObject)[0]];
}});
