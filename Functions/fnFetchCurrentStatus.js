//fnFetchCurrentStatus

db.system.js.save({_id:"fnFetchCurrentStatus",
"value":function(data){

	var tab=data.tab;
	var userId=ObjectId(data.userId);
	var companyId=ObjectId(data.companyId);
	var result='';
	if((tab=='Account')||(tab=='Job')){
		result=db.clnUserDetails.findOne({fkUserLoginId:userId,activeFlag:1},{status:1,_id:0});
		if(result.status==undefined){
			result.status={};
			result.status[tab]='';

		}

	}else if(tab=='Course'){
		var result=db.clnUserCourseMapping.find({fkUserLoginId:userId,activeFlag:1},{status:1,Name:1,_id:1}).toArray();
		if(result.length>0){
			for(var index in result){
				if(result[index].status==undefined){
					result[index].status='';
				}
			}
		}


	}



	return result;

}});