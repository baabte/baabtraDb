
db.system.js.save({_id: "fnAddNewBatches",
    value: function (batchObj){
    // write your code here
    batchObj._id=new ObjectId();
    batchObj.createdDate=ISODate();
    batchObj.updatedDate=ISODate();
    if (batchObj.Codes) {
    var Codes=batchObj.Codes
    delete batchObj.Codes;
    };
    //if(batchObj.repeats.startDate!=undefined){
    batchObj.startDate=ISODate(batchObj.startDate);
    batchObj.endDate=ISODate(batchObj.endDate);
    
    var enrollmentBefore =new Date();
    var enrollmentAfter =new Date();


    enrollmentAfter=new Date(batchObj.startDate.getTime() - batchObj.Admission.beforeDaysCount*24*60*60*1000);//to get the enrollment before date
    enrollmentBefore=new Date(batchObj.startDate.getTime() + batchObj.Admission.afterDaysCount*24*60*60*1000);//to get the enrollment after days   

    //function to create batchCoursemapping if empty batch option is 
    var batchCourseMappingData={};
    fnCreateCourseBatchMapping =function(batch){
      batchCourseMappingData={batchId:batch._id, batchName:batch.batchName,batchMode:batch.batchMode, courseType:batch.courseType, startDate:batch.startDate, endDate:batch.endDate, startTime:batch.startTime, endTime:batch.endTime, seats:batch.seats,repeats:batch.repeats, courseType:batch.courseType,materialAssignment:batch.materialAssignment ,enrollmentBefore:enrollmentBefore,enrollmentAfter:enrollmentAfter,createdDate:Date(), updatedDate:Date(), crmId:batch.crmId, urmId:batch.urmId, activeFlag:1, fkCompanyId:batch.companyId, users:[],status:'active'}
      batchCourseMappingData.evaluator='';
      for(var index in batch.course){
        batchCourseMappingData.batchCode=Codes[index];
        batchCourseMappingData.fkCourseId=ObjectId(batch.course[index]._id)

        var course = db.clnCourses.findOne({_id:batchCourseMappingData.fkCourseId}, {_id:0, Name:1, courseTimeline:1, Duration:1, Description:1, courseImg:1, totalMark:1, selectedDuration:1, elementOrder:1,syllabus:1,markSheetElements:1});

        if (batch.materialAssignment) {
                        if (batch.materialAssignment == "automatic") {
                             batchCourseMappingData.syllabus=course.syllabus;
                             batchCourseMappingData.markSheetElements=course.markSheetElements;
                             batchCourseMappingData.selectedDuration=course.selectedDuration;
                             batchCourseMappingData.courseTimeline=course.courseTimeline;
                             batchCourseMappingData.elementOrder=course.elementOrder;

                        } else if (batch.materialAssignment == "cascade") {
                            var elementOrder = course.elementOrder[0];
                            var keyArray = elementOrder.split(".");
                            var tlpoint = keyArray[0];
                            var courseTimeline={};
                            courseTimeline[tlpoint]=course.courseTimeline[tlpoint]
                            if(courseTimeline[tlpoint].totalMark){
                                var totalMark=courseTimeline[tlpoint].totalMark;
                            }else{
                                 var totalMark=0;
                            }
                            var newElementOrder={};
                            
                            for(var key in course.elementOrder){
                                 var orderArray = course.elementOrder[key].split(".");
                                if(orderArray[0]==tlpoint){
                                    newElementOrder[key]=course.elementOrder[key];                                
                                }                                
                            }

                              batchCourseMappingData.syllabus=course.syllabus;
                              batchCourseMappingData.markSheetElements=course.markSheetElements;
                              batchCourseMappingData.selectedDuration=course.selectedDuration;
                              batchCourseMappingData.courseTimeline=courseTimeline;
                              batchCourseMappingData.elementOrder=newElementOrder;

                        } else if (batch.materialAssignment == "manual") {
                              batchCourseMappingData.syllabus=course.syllabus;
                              batchCourseMappingData.markSheetElements=course.markSheetElements;
                              batchCourseMappingData.selectedDuration=course.selectedDuration;
                        }
                    } else {
                          batchCourseMappingData.syllabus=course.syllabus;
                          batchCourseMappingData.markSheetElements=course.markSheetElements;
                          batchCourseMappingData.selectedDuration=course.selectedDuration;                                            
                    }
                    db.clnCourseBatchMapping.insert(batchCourseMappingData);

      }
    };


   if (batchObj.instructorLead == true &&  batchObj.offline == true ) {//checking whether the object is exist 
       delete batchObj.instructorLead;
       delete batchObj.offline;
          batchObj.courseType="instructorLead"
        result= db.clnBatches.insert(batchObj);
         batchObj.courseType="offline"
        result= db.clnBatches.insert(batchObj);
       
   } else if(batchObj.instructorLead == true){
        delete batchObj.instructorLead;
       delete batchObj.offline;
       batchObj.courseType="instructorLead"
      result= db.clnBatches.insert(batchObj);
   } else if(batchObj.offline == true){
       delete batchObj.instructorLead;
       delete batchObj.offline;
      batchObj.courseType="offline"
    result= db.clnBatches.insert(batchObj);
    
   }
    fnCreateCourseBatchMapping(batchObj);
    return batchObj;
}});






db.system.js.save({_id:'fnExistingMaterialsFetch',
value:function(data) {
  var courseId=ObjectId(data.courseId);

  var course=db.clnCourses.findOne({_id:courseId},{courseTimeline:1,syllabus:1})

	return course;

}});



db.system.js.save({_id: "fnUpdateBatch",
		value: function (batchObj) 
{
   // write your code here
    if(batchObj.Codes){
      delete batchObj.Codes;
    }
    batchObj.createdDate=ISODate();
    batchObj.updatedDate=ISODate();
    batchObj.startDate=ISODate(batchObj.startDate);
    batchObj.endDate=ISODate(batchObj.endDate);
    if (batchObj.instructorLead == true &&  batchObj.offline == true ) {//checking whether the object is exist 
       delete batchObj.instructorLead;
       delete batchObj.offline;
       batchObj.courseType="instructorLead"
       result= db.clnBatches.save(batchObj);
       delete batchObj._id; 
       batchObj.courseType="offline"
       result= db.clnBatches.insert(batchObj);
    }else if(batchObj.instructorLead == true){
        delete batchObj.instructorLead;
       delete batchObj.offline;
       batchObj.courseType="instructorLead"
      result=  db.clnBatches.save(batchObj);
   } else if(batchObj.offline == true){
       delete batchObj.instructorLead;
       delete batchObj.offline;
      batchObj.courseType="offline"
    result= db.clnBatches.save(batchObj);
   }
    return batchObj;
}});



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




db.system.js.save({
    "_id" : "fnGetCourses",
    "value" : function(data) {

    	var companyId=ObjectId(data.companyId);

  var Courses=db.clnCourses.find({companyId:companyId,activeFlag:1,courseTimeline:{$exists:1},type:'course'},{_id:1,Name:1,draftFlag:1}).toArray();
  
	return Courses;

}});

