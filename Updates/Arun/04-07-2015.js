//fnfetchUserResultReport

db.system.js.save({
    "_id" : "fnfetchUserResultReport",
    "value" : function(companyId,searchKey,course,date) {
   var result;
    var resultObj={};


    function objectIdWithTimestamp(timestamp) {
    // Convert string date to Date object (otherwise assume timestamp is a date)
    if (typeof(timestamp) == 'string') {
        timestamp = new Date(timestamp);
    }

    // Convert date object to hex seconds since Unix epoch
    var hexSeconds = Math.floor(timestamp/1000).toString(16);

    // Create an ObjectId with that hex timestamp
    var constructedObjectId = ObjectId(hexSeconds + "0000000000000000");

    return constructedObjectId
	}


// Find all documents created after midnight on May 25th, 1980
// db.mycollection.find({ _id: { $gt: objectIdWithTimestamp('1980/05/25') } });

    if((date.fromDate!=undefined)&&(date.toDate!=undefined)){
        var userloginIds=db.clnUserCourseMapping.distinct('fkUserLoginId',{_id: { $gt: objectIdWithTimestamp(date.fromDate),$lt: objectIdWithTimestamp(date.toDate)  },fkCompanyId:ObjectId(companyId),fkCourseId:ObjectId(course._id)});
    }else if (date.fromDate!=undefined){
        var userloginIds=db.clnUserCourseMapping.distinct('fkUserLoginId',{_id: { $gt: objectIdWithTimestamp(date.fromDate)},fkCompanyId:ObjectId(companyId),fkCourseId:ObjectId(course._id)});
    }else if (date.toDate!=undefined){
        var userloginIds=db.clnUserCourseMapping.distinct('fkUserLoginId',{_id: { $lt: objectIdWithTimestamp(date.toDate)},fkCompanyId:ObjectId(companyId),fkCourseId:ObjectId(course._id)});                
    }else{
        var userloginIds=db.clnUserCourseMapping.distinct('fkUserLoginId',{fkCompanyId:ObjectId(companyId),fkCourseId:ObjectId(course._id)});
    }

    
     

        result=db.clnUserDetails.find({"profile.CollegeName":{$regex:new RegExp(searchKey,'i')},"fkUserLoginId":{$in:userloginIds}},{profile:1,fkUserLoginId:1,userName:1}).sort({_id:-1}).toArray();   

        if(result.length!=0){  
        	var resultArray=[];
        	for(var i in result){
        		var user=result[i];
        		var tempArray=[];
        		var tempuserCourse=db.clnUserCourseMapping.findOne({fkCourseId:ObjectId(course._id),fkUserLoginId:user.fkUserLoginId},{totalMark:1,markScored:1,_id:0});
        		user.totalMark=tempuserCourse.totalMark;
        		user.markScored=tempuserCourse.markScored;
        		tempArray=[user.profile.firstName+' '+user.profile.lastName,user.profile.CollegeName,user.markScored+'/'+user.totalMark];
        		resultArray.push(tempArray);

        	}
        }

    
    resultObj.userList=resultArray;
    resultObj.searchKey=searchKey;
    resultObj.selectedTest=[course];
    resultObj.date=date;  

    return resultObj;
}
});




//fnfetchCourseList
db.system.js.save({_id: "fnfetchCourseList",
      value: function (courseFetchData) {
    var companyId=ObjectId(courseFetchData.fkcompanyId);
    if(courseFetchData.type!=undefined){
      var type=courseFetchData.type;
    }else{
      var type='all';

    }

    var providerArray=db.clnReseller.distinct('providers.companyId',{fkCompanyId:companyId});
    if(providerArray==null) {
    providerArray=[];
    }
    providerArray.push(companyId);

    var providerCourses=db.clnReseller.findOne({fkCompanyId:companyId},{_id:0,'providers.courses':1});

    var coursesArray=db.clnCourses.distinct('_id',{companyId:companyId});
    
    if(providerCourses!=null){
        for(var index in providerCourses.providers){            
        providerCourses.providers[index].courses
                coursesArray= providerCourses.providers[index].courses.concat(coursesArray);
              
        }
    }

    if(type=='all'){
    var courselist = db.clnCourses.find({_id:{$in:coursesArray},
                          companyId:{$in:providerArray},draftFlag:1, activeFlag:1}, {_id:1, Name:1}).toArray();
  }else{
     var courselist = db.clnCourses.find({_id:{$in:coursesArray},
                          companyId:{$in:providerArray},type:type,draftFlag:1, activeFlag:1}, {_id:1, Name:1}).toArray();
  }
    return courselist;
}});