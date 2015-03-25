db.system.js.save({_id:"fnGetCurrentMenusById",value:function(e,n){return"string"==typeof e&&(e=ObjectId(e)),data="role"==n?db.clnRoleMenuMapping.findOne({fkRoleId:e,activeFlag:1}):"all"==n?db.clnMenuMaster.find({activeFlag:1}).toArray():db.clnUserMenuMapping.find({fkUserRoleMappingId:e,activeFlag:1}).toArray()}});

db.system.js.save({_id:"fnApproveUserRequest",value:function(e,r,d,s,n,t){for(var o=db.clnTrainingRequest.findOne({companyId:ObjectId(t),orderFormId:r}),a=0;o.orderDetails[d].userInfo.length>a;a++)-1!=e.indexOf(o.orderDetails[d].userInfo[a].userId)&&(o.orderDetails[d].userInfo[a].status=s);return db.clnTrainingRequest.update({companyId:ObjectId(t),orderFormId:r},{$set:{orderDetails:o.orderDetails}}),o}});

db.system.js.save({_id:"fnLoadMenteesForApprove",value:function(e){return db.clnTrainingRequest.find({companyId:ObjectId(e)},{orderDetails:1,orderFormId:1,crmId:1}).toArray()}});

db.system.js.save({_id:'fnLoadDepartments',
value:function(companyId, branchId) {
    var department = db.clnDepartments.findOne({companyId: ObjectId(companyId)});
    
    return department.departments[branchId];
}});

db.system.js.save({_id:"fnAddDepartment",value:function(e,d,t){var a=db.clnDepartments.findOne({companyId:ObjectId(d)}),n="";if(null!=a){a.departments[Object.keys(e)[0]]=e[Object.keys(e)[0]],a.updatedDate=ISODate(),a.urmId=ObjectId(t),n=a.departments[Object.keys(e)[0]];for(var r=0;n.length>r;r++)null!=n[r].deptHeadrmId&&(n[r].departmentId=void 0==n[r].departmentId?new ObjectId:ObjectId(n[r].departmentId),n[r].deptHeadrmId[0].roleMappingId=ObjectId(n[r].deptHeadrmId[0].roleMappingId));a.departments[Object.keys(e)[0]]=n,db.clnDepartments.save(a)}else{for(var I={},n=e[Object.keys(e)[0]],r=0;n.length>r;r++)n[r].departmentId=new ObjectId,null!=n[r].deptHeadrmId&&(n[r].deptHeadrmId[0].roleMappingId=ObjectId(n[r].deptHeadrmId[0].roleMappingId));e[Object.keys(e)[0]]=n,I.departments=e,I.companyId=ObjectId(d),I.createdDate=ISODate(),I.updatedDate=ISODate(),I.urmId=ObjectId(t),I.crmId=ObjectId(t),I.activeFlag=1}var I=db.clnDepartments.findOne({companyId:ObjectId(d)});return I.departments[Object.keys(e)[0]]}});

db.system.js.save({_id:"fnInsertNotificationDetails",value:function(e,t,i,a,n){var o={};o.userRoleMappingId="",o.notification=[{type:i,typeId:t,date:ISODate(),message:a}],o.createdDate=ISODate(),o.updatedDate=ISODate(),o.crmId=n,o.urmId=n,o.activeFlag=1;var d="";if(null!=e.length)for(var l=0;l<e.length;l++)o.userRoleMappingId=e[l],n.str!=e[l].valueOf()&&(d=db.clnNotification.findOne({userRoleMappingId:o.userRoleMappingId}),null==d?db.clnNotification.insert(o):db.clnNotification.update({userRoleMappingId:o.userRoleMappingId},{$push:{notification:o.notification[0]}}));return"Success"}});


db.system.js.save({_id:"fnViewFeedbackRequests",value:function(e,t){var d={},a=db.clnFeedbacks.find({targetList:{$in:[ObjectId(e)]},companyId:ObjectId(t),userResponse:{$not:{$elemMatch:{rmId:ObjectId(e)}}}},{title:1,description:1,createdDate:1}).sort({createdDate:-1}).toArray(),c=db.clnFeedbacks.find({targetList:{$in:[ObjectId(e)]},companyId:ObjectId(t),userResponse:{$elemMatch:{rmId:ObjectId(e)}}},{title:1,description:1,createdDate:1}).sort({createdDate:-1}).toArray();return d.pendingFeedback=a,d.submitedFeedback=c,d}});

db.system.js.save({_id:"fnLoadUserCardDetail",value:function(e){var d={},n=db.clnUserRoleMapping.findOne({_id:ObjectId(e)},{fkRoleId:1,fkUserLoginId:1,_id:0});d.roleMappingId=ObjectId(e),d.roleId=n.fkRoleId,d.loginId=n.fkUserLoginId;var a=db.clnRoleMaster.findOne({_id:n.fkRoleId},{roleName:1});switch(d.userName=db.clnUserLogin.findOne({_id:n.fkUserLoginId},{userName:1,_id:0}).userName,d.roleName=a.roleName,d.roleId){case 2:var r=db.clnCompany.findOne({fkuserLoginId:d.loginId},{companyName:1});d.Name=r.companyName;break;default:var i=db.clnUserDetails.findOne({fkUserLoginId:d.loginId},{profile:1});d.Name=i.profile.firstName+" "+i.profile.lastName}return d}});
