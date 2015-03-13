
roleSAMasterDataId= 1;	//create id 

roleSAMasterData ={_id:roleSAMasterDataId,roleName: "Super Admin",roleDescription: "access to all",createdDate: Date(),updatedDate:Date(),crmId: "",urmId: "",activeFlag:1 }

db.clnRoleMaster.insert(roleSAMasterData);

//entering superadmin data to database

userSALoginDataId= new ObjectId();
SAUserRoleMappingDataId=new ObjectId();

SAUserRoleMappingData={_id:SAUserRoleMappingDataId,fkRoleId: roleSAMasterDataId,fkUserLoginId: userSALoginDataId,fkCompanyId: "",fkEmployeeId: "",fkConsumerId: "",groups: [],createdDate: Date(),updatedDate: Date(),crmId: "",urmId: "",activeFlag:1}

db.clnUserRoleMapping.insert(SAUserRoleMappingData);



userSALoginData={_id:userSALoginDataId,userName:'baabte@baabte',password:'admin123',roleMappings:[SAUserRoleMappingDataId],lastLoggedRoleMapping:SAUserRoleMappingDataId,createdDate: Date(),updatedDate:Date(),crmId: "",urmId: "",activeFlag:1 }

db.clnUserLogin.insert(userSALoginData);



roleCAMasterDataId = 2;
roleCAMasterData={_id:roleCAMasterDataId ,roleName: "CompanyAdmin" ,roleDescription: "Role of Company Admin" ,companyId: "" ,createdDate: Date() ,updatedDate: Date() ,crmId: SAUserRoleMappingDataId ,urmId: "",activeFlag:1 }

db.clnRoleMaster.insert(roleCAMasterData);




