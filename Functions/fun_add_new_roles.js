//fun_add_new_roles

db.system.js.save({_id: "fun_add_new_roles",
                  value: function (data) {
    
			if(data.role==1){
				data._id= new ObjectId();
				data.createdDate=Date();
				data.updatedDate=Date();
				data.activeFlag=1;
                                data.companyId="";
                                delete data.role;
				db.clnRoleMaster.insert(data);

			}
			else{
				data._id= new ObjectId();
				data.createdDate=Date();
				data.updatedDate=Date();
				data.activeFlag=1;
				data.companyId=ObjectId(data.companyId),
                                delete data.role;
				db.clnRoleMaster.insert(data);
				var menu={
					'_id': new ObjectId(),
					'MenuLink': "userRegistration",
					'MenuName': "Register a "+data.roleName,
					'actions':[{'actionName': "Register",'stateName': "home.main.userRegistration|code:"+data._id.valueOf()}],
					'activeFlag': 1,
					'canView': true,
					'menuIcon': "fa-user",
					'createdDate': Date(),
					'updatedDate': Date(),
					'crmId': "",
					'urmId': ""
					}
				fnInsertMenu(menu);	

				menu.fkMenuId=menu._id;
				menu.childMenuStructure=[];
				delete menu._id;
				delete menu.crmId;
				delete menu.urmId;
				delete createdDate;
				delete updatedDate;

			adminRoleMappingId=	db.clnUserRoleMapping.findOne({fkCompanyId :data.companyId,fkRoleId:2},{_id:1});

			userMenu=db.clnUserMenuMapping.findOne({"fkUserRoleMappingId" : adminRoleMappingId._id});

			userMenu.menuStructure[0].regionMenuStructure.push(menu);

			db.clnUserMenuMapping.save(userMenu);

			}

			
}})