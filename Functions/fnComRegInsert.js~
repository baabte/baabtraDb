//fnComRegInsert
function (data)
 {
 //ids to insert into clnUserRoleMapping,clnUserLogin,clnCompany
 var companyAdminroleId=2;
 var UserRoleMappingDataId= new ObjectId();
 var userLoginDataId= new ObjectId();
 var companyDataId=new ObjectId();
 var companyLogo=companyDataId.valueOf();
 var menu =db.clnRoleMenuMapping.findOne({fkRoleId:companyAdminroleId},{_id:0,menuStructure:1});


 //data to clnUserRoleMapping
 UserRoleMappingData={_id:UserRoleMappingDataId,fkRoleId:companyAdminroleId,fkUserLoginId:userLoginDataId,fkCompanyId:companyDataId,fkEmployeeId:"",fkConsumerId:"",groups:[],createdDate:Date(),updatedDate:Date(),crmId:data.loggedusercrmid,urmId:data.loggedusercrmid,activeFlag:1}
// insertion to clnUserRoleMapping
 db.clnUserRoleMapping.insert(UserRoleMappingData);

//data to clnUserLogin
 UserLoginData={_id: userLoginDataId, userName: data.eMail, password: data.password, roleMappings:[UserRoleMappingDataId],lastLoggedRoleMapping:UserRoleMappingDataId,createdDate:Date(),updatedDate:Date(),crmId:data.loggedusercrmid,urmId:data.loggedusercrmid,activeFlag:1}
// insertion to clnUserLogin
db.clnUserLogin.insert(UserLoginData);



 usermenuData={fkUserRoleMappingId :UserRoleMappingDataId,menuStructure :menu.menuStructure ,createdDate : Date(),updatedDate : Date(),crmId : data.loggedusercrmid,urmId : data.loggedusercrmid,"activeFlag" : 1}
            
 db.clnUserMenuMapping.insert(usermenuData)


//data to clnCompany
 companyData={_id:companyDataId,fkuserLoginId: userLoginDataId,companyName: data.companyName,fkSectorId: data.fksectorId,eMail: data.eMail,alternateEmail: data.alternateEmail,Phone: data.Phone,Mobile: data.Mobile,Fax: data.Fax,webSite: data.webSite,fkCountryId: data.fkcountryId,fkStateId: data.fkstateId,fkDistrictId: data.fkdistrictId,zipCode:data.zipCode,Address: data.Address,facebook: data.Facebook,gplus: data.Google,twitter: data.Twitter,linkedin: data.LinkedIn,tagLine:data.tagLine,companyLogo:companyLogo,createdDate:Date(),updatedDate:Date(),crmId:data.loggedusercrmid,urmId:data.loggedusercrmid,activeFlag:1}
 // insertion to clnCompany
db.clnCompany.insert(companyData);
var result={cmail:companyData.eMail,cLogo:companyLogo,companyId:companyDataId};

 return result;

}