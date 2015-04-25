/*
Created by : Jihin
Date : 18-3-2015
purpose : For Load Mentees For Approve
*/

db.system.js.save({_id:'fnLoadMenteesForApprove',
value:function(companyId, statusType) {
    var data = {};
    data.orderFroms = db.clnTrainingRequest.find({companyId:ObjectId(companyId), "orderDetails.userInfo.status":{$in:statusType}}).toArray();
    var company = db.clnCompany.findOne({_id:ObjectId(companyId)});
    var companyDetails ={};
    companyDetails.companyName = company.companyName;
    companyDetails.Address = company.Address;
    companyDetails.Phone = company.Phone;
    companyDetails.eMail = company.eMail;
    companyDetails.Fax = company.Fax;
    companyDetails.companyLogo = company.appSettings.logo;
    data.companyDetails = companyDetails;
    
return data;
}});
