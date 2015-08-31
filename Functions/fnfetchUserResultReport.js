// //fnfetchUserResultReport

// db.system.js.save({
//     "_id" : "fnfetchUserResultReport",
//     "value" : function(companyId,searchKey,course,date) {
//    var result;
//     var resultObj={};


//     function objectIdWithTimestamp(timestamp) {
//     // Convert string date to Date object (otherwise assume timestamp is a date)
//     if (typeof(timestamp) == 'string') {
//         timestamp = new Date(timestamp);
//     }

//     // Convert date object to hex seconds since Unix epoch
//     var hexSeconds = Math.floor(timestamp/1000).toString(16);

//     // Create an ObjectId with that hex timestamp
//     var constructedObjectId = ObjectId(hexSeconds + "0000000000000000");

//     return constructedObjectId
// 	}


// // Find all documents created after midnight on May 25th, 1980
// // db.mycollection.find({ _id: { $gt: objectIdWithTimestamp('1980/05/25') } });

//     if((date.fromDate!=undefined)&&(date.toDate!=undefined)){
//         var userloginIds=db.clnUserCourseMapping.distinct('fkUserLoginId',{_id: { $gt: objectIdWithTimestamp(date.fromDate),$lt: objectIdWithTimestamp(date.toDate)  },fkCompanyId:ObjectId(companyId),fkCourseId:ObjectId(course._id)});
//     }else if (date.fromDate!=undefined){
//         var userloginIds=db.clnUserCourseMapping.distinct('fkUserLoginId',{_id: { $gt: objectIdWithTimestamp(date.fromDate)},fkCompanyId:ObjectId(companyId),fkCourseId:ObjectId(course._id)});
//     }else if (date.toDate!=undefined){
//         var userloginIds=db.clnUserCourseMapping.distinct('fkUserLoginId',{_id: { $lt: objectIdWithTimestamp(date.toDate)},fkCompanyId:ObjectId(companyId),fkCourseId:ObjectId(course._id)});                
//     }else{
//         var userloginIds=db.clnUserCourseMapping.distinct('fkUserLoginId',{fkCompanyId:ObjectId(companyId),fkCourseId:ObjectId(course._id)});
//     }

    
     

//         result=db.clnUserDetails.find({"profile.CollegeName":{$regex:new RegExp(searchKey,'i')},"fkUserLoginId":{$in:userloginIds}},{profile:1,fkUserLoginId:1,userName:1}).sort({_id:-1}).toArray();   

//         if(result.length!=0){  
//         	var resultArray=[];
//         	for(var i in result){
//         		var user=result[i];
//         		var tempArray=[];
//                 fields=['firstName','lastName','CollegeName','YearOfPassing','course']
//                 for(index in fields){
//                     if(user.profile[fields[index]]==undefined){
//                         user.profile[fields[index]]=""
//                     }
//                 }

//         		var tempuserCourse=db.clnUserCourseMapping.findOne({fkCourseId:ObjectId(course._id),fkUserLoginId:user.fkUserLoginId},{totalMark:1,markScored:1,_id:0});
//         		user.totalMark=tempuserCourse.totalMark;
//         		user.markScored=tempuserCourse.markScored;
//         		tempArray=[user.profile.firstName+' '+user.profile.lastName,user.profile.CollegeName,user.markScored+'/'+user.totalMark,user.profile.YearOfPassing,user.profile.course];
//         		resultArray.push(tempArray);

//         	}
//         }

    
//     resultObj.userList=resultArray;
//     resultObj.searchKey=searchKey;
//     resultObj.selectedTest=[course];
//     resultObj.date=date;  

//     return resultObj;
// }
// });



///funtion for detailed fnfetchUserResultReport

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
        var userloginIds=db.clnUserCourseMapping.distinct('fkUserLoginId',{_id: { $gt: objectIdWithTimestamp(date.fromDate),$lt: objectIdWithTimestamp(date.toDate)  },fkCompanyId:ObjectId(companyId),fkCourseId:ObjectId(course._id),activeFlag:1});
    }else if (date.fromDate!=undefined){
        var userloginIds=db.clnUserCourseMapping.distinct('fkUserLoginId',{_id: { $gt: objectIdWithTimestamp(date.fromDate)},fkCompanyId:ObjectId(companyId),fkCourseId:ObjectId(course._id),activeFlag:1});
    }else if (date.toDate!=undefined){
        var userloginIds=db.clnUserCourseMapping.distinct('fkUserLoginId',{_id: { $lt: objectIdWithTimestamp(date.toDate)},fkCompanyId:ObjectId(companyId),fkCourseId:ObjectId(course._id),activeFlag:1});                
    }else{
        var userloginIds=db.clnUserCourseMapping.distinct('fkUserLoginId',{fkCompanyId:ObjectId(companyId),fkCourseId:ObjectId(course._id),activeFlag:1});
    }

    
     

        result=db.clnUserDetails.find({"profile.CollegeName":{$regex:new RegExp(searchKey,'i')},"fkUserLoginId":{$in:userloginIds}},{profile:1,fkUserLoginId:1,userName:1}).sort({_id:-1}).toArray();   

        if(result.length!=0){  
            var resultArray=[];
            for(var i in result){
                var user=result[i];
                var tempArray=[];
            fields=['firstName','lastName','CollegeName','YearOfPassing','course','branch','mobile','District','Location','PreferredWorkingLocations']
                for(index in fields){
                    if(user.profile[fields[index]]==undefined){
                        user.profile[fields[index]]=""
                    }
                }
                var tempuserCourse=db.clnUserCourseMapping.findOne({fkCourseId:ObjectId(course._id),fkUserLoginId:user.fkUserLoginId},{totalMark:1,markScored:1,_id:0});
                user.totalMark=tempuserCourse.totalMark;
                user.markScored=tempuserCourse.markScored;
                tempArray=[user.profile.firstName+' '+user.profile.lastName,user.profile.CollegeName,user.markScored+'/'+user.totalMark,user.profile.YearOfPassing,user.profile.course,user.profile.branch,user.profile.mobile,user.userName,user.profile.District,user.profile.Location,user.profile.PreferredWorkingLocations];
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