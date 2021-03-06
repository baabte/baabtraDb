/*
Created by : Jihin
Date : 18-3-2015
purpose : For Load Mentees For Approve

Created by : Jihin
Date : 20-5-2015
purpose : For search order form

updated by : Lijin
Date : 27-5-2015
Purpose: Added user Id to searchable field

updated by : Arun
Date : 29-5-2015
Purpose: orderFormType added to menteeload
*/

db.system.js.save({_id:'fnLoadMenteesForApprove',
value:function(companyId, statusType, pageNumber, nPerPage, searchKey,orderFormType) {
	var data = {};
	if(!orderFormType){
		var orderFormType='';
	}
	 if(orderFormType==''){
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
			{"requesteeDetails.type" :{$regex:new RegExp(searchKey,'i')}},
			{'orderDetails.userInfo.userCode':{$regex:new RegExp(searchKey, "i")}}
			], companyId:ObjectId(companyId), "orderDetails.userInfo.status":{$in:statusType}}).skip(
    pageNumber > 0 ? ((pageNumber-1)*nPerPage) : 0).sort({customCompanyCode:-1}).limit(nPerPage).toArray();
	}

    }else{

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
			{"requesteeDetails.type" :{$regex:new RegExp(searchKey,'i')}},
			{'orderDetails.userInfo.userCode':{$regex:new RegExp(searchKey, "i")}}
			], companyId:ObjectId(companyId),'requesteeDetails.type':orderFormType,"orderDetails.userInfo.status":{$in:statusType}}).skip(
    pageNumber > 0 ? ((pageNumber-1)*nPerPage) : 0).sort({customCompanyCode:-1}).limit(nPerPage).toArray();
	}
	
	}
    return data;
}});
