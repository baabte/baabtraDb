db.system.js.save({
	
	"_id" : "fnCustomFormUserRegistration",
	"value" : function(orderObject, rmId) {
                var companyId = orderObject.companyId;
		var orderFormResponse = fnAddUserNomination(orderObject, rmId);
		var loginId = orderFormResponse.orderDetails[0].userInfo[0].userLoginId;
		var courseAllocate = {};
		courseAllocate.companyId = companyId;
		courseAllocate.date = new Date().toISOString();
		courseAllocate.loggedusercrmid = loginId;
		courseAllocate.selectedCourse = {};
		courseAllocate.selectedCourse._id = orderFormResponse.orderDetails[0].courseId;
		courseAllocate.selectedUsers = {};
		courseAllocate.selectedUsers[loginId] = {fkUserLoginId:loginId};
		var fnAllocateUsersToCourseCallback = fnAllocateUsersToCourse(courseAllocate);
		return {reuslt:courseAllocate};				
}})
