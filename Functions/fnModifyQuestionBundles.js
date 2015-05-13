//fnModifyQuestionBundles

db.system.js.save({_id: "fnModifyQuestionBundles",
      value: function (data) {

      	data.companyId=ObjectId(data.companyId);
      	loggedusercrmid=ObjectId(data.loggedusercrmid)
      	delete data.loggedusercrmid;
      	delete data.expandDetails
      	if(data._id){
      		data._id=ObjectId(data._id);
      	}else{
                  data.activeFlag=1;
            }
      	data.createdDate=Date();
		data.updatedDate=Date();
		data.crmId=loggedusercrmid;
		data.urmId=loggedusercrmid;
		db.clnQuestionBank.save(data);
      	return data;

}});