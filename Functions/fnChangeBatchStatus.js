/*created by :arun
date:2-5-15
*/

db.system.js.save({_id: "fnChangeBatchStatus",
    value: function (data){
    	var courseBatchMappingId=ObjectId(data.courseBatchMappingId);
    	var companyId=ObjectId(data.companyId);
    	var rmId=ObjectId(data.rmId);

    	var courseBatch=db.clnCourseBatchMapping.findOne({_id:courseBatchMappingId},{status:1,statusHistory:1});
    	var oldStatus;
    	var statusHistoryObj={};
    	var statusHistory=[];
    	if ((courseBatch.status)&&(courseBatch.statusHistory)){
    		oldStatus=courseBatch.status;
    		statusHistoryObj.statusChangedOn=Date();
    		statusHistoryObj.previousStatus=oldStatus;
    		statusHistoryObj.statusChangedby=data.rmId;
    		statusHistoryObj.statusChangedTo=data.status;
    		statusHistory=courseBatch.statusHistory;
    		statusHistory.push(statusHistoryObj);
    	}
    	else if(courseBatch.status){
    		oldStatus=courseBatch.status;
    		statusHistoryObj.statusChangedOn=Date();
    		statusHistoryObj.previousStatus=oldStatus;
    		statusHistoryObj.statusChangedby=data.rmId;
    		statusHistoryObj.statusChangedTo=data.status;
    		statusHistory.push(statusHistoryObj);
    	}else{
    		statusHistoryObj.statusChangedOn=Date();
    		statusHistoryObj.previousStatus=null;
    		statusHistoryObj.statusChangedby=data.rmId;
    		statusHistoryObj.statusChangedTo=data.status;
    		statusHistory.push(statusHistoryObj);
    	}
    	

    	db.clnCourseBatchMapping.update({_id:courseBatchMappingId},{$set:{status:data.status,statusHistory:statusHistory, updatedDate:Date(),urmId:rmId}});

    	var NotificationTriggersData={
    		type:'batch-status-update',
			data:{batchMappingId:data.rmId,
			date:Date()},
			companyId:data.companyId,
			crmId:data.rmId,
			status:1
		};

    	db.clnNotificationTriggers.insert(NotificationTriggersData)
    	return data;


}});