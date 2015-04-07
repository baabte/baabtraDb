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
					'createdDate': "Tue Apr 07 2015 10:23:33 GMT+0530 (IST)",
					'updatedDate': "Tue Apr 07 2015 10:23:33 GMT+0530 (IST)",
					'crmId': "",
					'urmId': ""
					}
				fnInsertMenu(menu);	

			}

			
}});