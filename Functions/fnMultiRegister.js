//fnMultiRegister

db.system.js.save({_id: "fnMultiRegister",
      value: function (data) {

var formData=data.formData;

 //ids to insert into clnUserRoleMapping,clnUserLogin,clnCompany
 var companyAdminroleId=2;
 var UserRoleMappingDataId= new ObjectId();
 var userLoginDataId= new ObjectId();
 var companyDataId=new ObjectId();
 var specificMenus =db.clnRoleMenuMapping.findOne({fkRoleId:companyAdminroleId},{_id:0,specificMenuStructure:1});
 var menu=specificMenus.specificMenuStructure[formData.companyType];
 formData.parentCompanyId=ObjectId(formData.parentCompanyId);

 var rmId=ObjectId(formData.rm_id);
 delete formData.rm_id;


 //data to clnUserRoleMapping
 UserRoleMappingData={_id:UserRoleMappingDataId,fkRoleId:companyAdminroleId,fkUserLoginId:userLoginDataId,fkCompanyId:companyDataId,companyType:formData.companyType,parentCompanyId:formData.parentCompanyId.valueOf(),fkEmployeeId:"",fkConsumerId:"",groups:[],createdDate:Date(),updatedDate:Date(),crmId:rmId,urmId:rmId,activeFlag:1}
// insertion to clnUserRoleMapping
 db.clnUserRoleMapping.insert(UserRoleMappingData);

//data to clnUserLogin
 UserLoginData={_id: userLoginDataId, userName: formData.eMail, password: formData.password, roleMappings:[UserRoleMappingDataId],companyId:companyDataId,lastLoggedRoleMapping:UserRoleMappingDataId,createdDate:Date(),updatedDate:Date(),crmId:rmId,urmId:rmId,activeFlag:1}
// insertion to clnUserLogin
db.clnUserLogin.insert(UserLoginData);


 usermenuData={fkUserRoleMappingId :UserRoleMappingDataId,companyId:companyDataId,menuStructure :menu ,createdDate : Date(),updatedDate : Date(),crmId :  rmId,urmId :  rmId,"activeFlag":1}
            
 db.clnUserMenuMapping.insert(usermenuData)


//data to clnCompany
 companyData=formData;
 companyData._id=companyDataId;
 companyData.fkuserLoginId=userLoginDataId;
 companyData.createdDate=Date();
 companyData.updatedDate=Date()
 companyData.crmId=rmId;
 companyData.urmId=rmId;
 companyData.appSettings={};
 companyData.activeFlag=1;
 // insertion to clnCompany
db.clnCompany.insert(companyData);


var globalconfigObj={
    "companyId" :companyDataId.valueOf(),
    "activeFlag" : 1,
    "createdDate" :Date(),
    "updatedDate" :Date(),
    "crmId" :  rmId,
    "urmId" :  rmId,
    "menuColor" : "random",
    "modernView" : "modern",
    "subTitleAndBackColor" : "random",
    "itemCodes" : []
};

db.clnGlobalSettings.insert(globalconfigObj);

return formData;



}});