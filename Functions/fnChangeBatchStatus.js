/*created by :arun
date:2-5-15
*/

db.system.js.save({_id: "fnChangeBatchStatus",
    value: function (data){
    	var courseBatchMappingId=ObjectId(data.courseBatchMappingId);
    	var companyId=ObjectId(data.companyId);
    	var rmId=ObjectId(data.rmId);


    	var courseBatch=db.clnCourseBatchMapping.findOne({_id:courseBatchMappingId},{status:1,statusHistory:1,batchId:1});

    	  var enrollmentBefore =new Date();
            var enrollmentAfter =new Date();
         if(data.startDate!=null){
            var batchObj= db.clnBatches.findOne({_id:courseBatch.batchId},{Admission:1,_id:0});
              data.startDate=ISODate(data.startDate);

            enrollmentAfter=new Date(data.startDate.getTime() - batchObj.Admission.beforeDaysCount*24*60*60*1000);//to get the enrollment before date
            enrollmentBefore=new Date(data.startDate.getTime() + batchObj.Admission.afterDaysCount*24*60*60*1000);//to get the enrollment after days   
 
        }


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
    	
        if(data.startDate!=null){
    	db.clnCourseBatchMapping.update({_id:courseBatchMappingId},{$set:{status:data.status,statusHistory:statusHistory,startDate:data.startDate,enrollmentBefore:enrollmentBefore,enrollmentAfter:enrollmentAfter, updatedDate:Date(),urmId:rmId}});
        }else{
        db.clnCourseBatchMapping.update({_id:courseBatchMappingId},{$set:{status:data.status,statusHistory:statusHistory, updatedDate:Date(),urmId:rmId}});

        }
    	var NotificationTriggersData={
    		type:'batch-status-update',
			data:{batchMappingId:data.courseBatchMappingId,
            rmId:data.rmId,
			date:Date()},
			companyId:data.companyId,
			crmId:data.rmId,
			status:1
		};

    	db.clnNotificationTriggers.insert(NotificationTriggersData)
    	return data;


}});