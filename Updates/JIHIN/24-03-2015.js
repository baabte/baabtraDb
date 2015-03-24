db.system.js.save({_id:"fnGetCurrentMenusById",value:function(e,n){return"string"==typeof e&&(e=ObjectId(e)),data="role"==n?db.clnRoleMenuMapping.findOne({fkRoleId:e,activeFlag:1}):"all"==n?db.clnMenuMaster.find({activeFlag:1}).toArray():db.clnUserMenuMapping.find({fkUserRoleMappingId:e,activeFlag:1}).toArray()}});

db.system.js.save({_id:"fnApproveUserRequest",value:function(e,r,d,s,n,t){for(var o=db.clnTrainingRequest.findOne({companyId:ObjectId(t),orderFormId:r}),a=0;o.orderDetails[d].userInfo.length>a;a++)-1!=e.indexOf(o.orderDetails[d].userInfo[a].userId)&&(o.orderDetails[d].userInfo[a].status=s);return db.clnTrainingRequest.update({companyId:ObjectId(t),orderFormId:r},{$set:{orderDetails:o.orderDetails}}),o}});

db.system.js.save({_id:"fnLoadMenteesForApprove",value:function(e){return db.clnTrainingRequest.find({companyId:ObjectId(e)},{orderDetails:1,orderFormId:1,crmId:1}).toArray()}});
