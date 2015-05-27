/*
Created by : Jihin
Date : 18-3-2015
purpose : For Load Mentees For Approve

Created by : Jihin
Date : 20-5-2015
purpose : For search order form
*/

db.system.js.save({_id:'fnLoadMenteesForApprove',
value:function(companyId, statusType, pageNumber, nPerPage, searchKey) {
	var data = {};
	data.type = "text";
	data.orderFroms = [];//db.clnTrainingRequest.find({$text: { $search: searchKey }, companyId:ObjectId(companyId), "orderDetails.userInfo.status":{$in:statusType}}).skip(
    //pageNumber > 0 ? ((pageNumber-1)*nPerPage) : 0).sort({customCompanyCode:-1}).limit(nPerPage).toArray();
	if(!data.orderFroms.length){
	data.type = "regex";
		data.orderFroms = db.clnTrainingRequest.find({
			$or:[
			{"status" :{$regex:new RegExp(searchKey,'i')}},
			{"requesteeDetails.eMail" :{$regex:new RegExp(searchKey,'i')}},
			{"customCompanyCode" :{$regex:new RegExp(searchKey,'i')}},
			{"requesteeDetails.type" :{$regex:new RegExp(searchKey,'i')}}
			], companyId:ObjectId(companyId), "orderDetails.userInfo.status":{$in:statusType}}).skip(
    pageNumber > 0 ? ((pageNumber-1)*nPerPage) : 0).sort({customCompanyCode:-1}).limit(nPerPage).toArray();
	}
    return data;
}});
