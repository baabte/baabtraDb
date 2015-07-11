//fnRegisterCollege

db.system.js.save({
    "_id" : "fnRegisterCollege",
    "value" : function (data) {
    	var college=JSON.parse(JSON.stringify(data.college));
    	var result=fnRegisterUser(college);
    	var collegeData={fkUserLoginId:result.userId,Courses:data.college.mandatoryData.Courses,address:data.college.mandatoryData.address,collegeName:data.college.mandatoryData.collegeName,contactPersons:data.college.mandatoryData.contactPersons,departments:data.college.mandatoryData.departments,eMail:data.college.mandatoryData.eMail,location:data.college.mandatoryData.location,companyId:ObjectId(data.college.companyId),crmId:ObjectId(data.college.loggedusercrmid),urmId:ObjectId(data.college.loggedusercrmid),createdDate:Date(),updatedDate:Date(),activeFlag:1};
    	db.clnCollege.save(collegeData);
    
    return result;
}});