//fnSetStatus

db.system.js.save({_id:"fnSetStatus",
"value":function(data){
var tab=data.tab;
var userId=ObjectId(data.userId);
var companyId=ObjectId(data.companyId);
var status=data.status;
var rm_id=data.rm_id;
var result='';
var previousStatus='';

if((tab=='Account')||(tab=='Job')){
		var UserDetails=db.clnUserDetails.findOne({fkUserLoginId:userId,activeFlag:1});
		
		if(UserDetails.status==undefined){
			UserDetails.status={};
		    previousStatus='';
		}else{
		previousStatus=UserDetails.status[tab];
		}
		UserDetails.status[tab]=status[tab];
		UserDetails.updatedDate=Date(),
		UserDetails.urmId=ObjectId(rm_id)
		

		var statusObj={statusChangedOn:Date(),previousStatus:previousStatus,statusChangedby:rm_id,statusChangedTo:status[tab]}
		if(UserDetails.statusHistory==undefined){
			UserDetails.statusHistory={};
		}
		if(UserDetails.statusHistory[tab]==undefined){
			UserDetails.statusHistory[tab]=[];
		}
		UserDetails.statusHistory[tab].push(statusObj);
		db.clnUserDetails.save(UserDetails);
		

	}else if(tab=='Course'){
		var course=db.clnUserCourseMapping.findOne({_id:ObjectId(status[tab]._id)},{status:1,statusHistory:1})
		if(course.status==undefined){
			course.status={};
		    previousStatus='';
		}else{
		previousStatus=course.status;
		}

		var statusObj={statusChangedOn:Date(),previousStatus:previousStatus,statusChangedby:rm_id,statusChangedTo:status[tab].status}
		if(course.statusHistory==undefined){
			course.statusHistory=[];
		}		
		course.statusHistory.push(statusObj);

		db.clnUserCourseMapping.update({_id:ObjectId(status[tab]._id)},{$set:{status:status[tab].status,statusHistory:course.statusHistory, updatedDate:Date(),urmId:ObjectId(rm_id)}});

	}

return {"tab":tab,"userId":userId,"companyId":companyId,"status":status,"result":result};

}});