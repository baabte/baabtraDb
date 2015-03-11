/* created by:Jihin
Date:10-03-2015
purpose:for load mentees under a company 

*/
db.system.js.save({_id: "fnLoadMenteesByCompanyId",
		value:function(CompanyId) {
    var userLoginIds = db.clnUserRoleMapping.distinct("fkUserLoginId",{fkRoleId:3,'profile.fkCompanyId':ObjectId(CompanyId),activeFlag:1});
    var mentess = db.clnUserDetails.find({fkUserLoginId:{$in:userLoginIds}},{_id:0,fkUserLoginId:1,'profile.firstName':1, 'profile.lastName':1}).toArray();
    return mentess;
}});
