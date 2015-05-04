/*
Created by : Jihin
Date : 18-3-2015
purpose : For Load Mentees For Approve
*/

db.system.js.save({_id:'fnLoadMenteesForApprove',
value:function(companyId, statusType, pageNumber, nPerPage) {
    var data = {};
    //data.orderFroms = db.clnTrainingRequest.find({companyId:ObjectId(companyId), "orderDetails.userInfo.status":{$in:statusType}}).toArray();
    data.orderFroms = db.clnTrainingRequest.find({companyId:ObjectId(companyId), "orderDetails.userInfo.status":{$in:statusType}}).skip(
    pageNumber > 0 ? ((pageNumber-1)*nPerPage) : 0).limit(nPerPage).toArray();
    
    /*var company = db.clnCompany.findOne({_id:ObjectId(companyId)});
    var companyDetails ={};
    companyDetails.companyName = company.companyName;
    companyDetails.Address = company.Address;
    companyDetails.Phone = company.Phone;
    companyDetails.eMail = company.eMail;
    companyDetails.Fax = company.Fax;
    companyDetails.companyLogo = company.appSettings.logo;
    data.companyDetails = companyDetails;*/
    
	return data;
}});
