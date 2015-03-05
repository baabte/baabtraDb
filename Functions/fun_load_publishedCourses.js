/*
Modified by :Vineeth C
Created On : 21/02/2015
Purpose: For adding an extra argument for course filtering while course search
*/

/*
Modified by :Vineeth C
Created On : 28/02/2015
Purpose:To use fulltextSearch while searching courses
*/

db.system.js.save({_id: "fun_load_publishedCourses",
		value: function (companyId,searchKey,searchRange,type) 
{
if (searchKey !=''){
  if(type!=''){
    switch(type){
    case 'Domains':  
    courses= db.clnCourses.find({Domains:searchKey,
    companyId:ObjectId(companyId),
    draftFlag:1, 
    activeFlag:1},
      {Name:1,courseImg:1,courseDetails:1}).skip(searchRange).limit(12).toArray();
      
 courseCount=db.clnCourses.find({Domains:searchKey,
    companyId:ObjectId(companyId),
    draftFlag:1, 
    activeFlag:1},
      {Name:1,courseImg:1,courseDetails:1}).skip(searchRange).limit(13). count(true); 
      break;
    case 'Technologies':  
      courses= db.clnCourses.find({'Technologies.text':searchKey,
    companyId:ObjectId(companyId),
    draftFlag:1, 
    activeFlag:1},
      {Name:1,courseImg:1,courseDetails:1}).skip(searchRange).limit(12).toArray();
      
 courseCount=db.clnCourses.find({'Technologies.text':searchKey,
    companyId:ObjectId(companyId),
    draftFlag:1, 
    activeFlag:1},
      {Name:1,courseImg:1,courseDetails:1}).skip(searchRange).limit(13). count(true); 
      break;
     case 'Branches':  
      courses= db.clnCourses.find({'Branches':searchKey,
    companyId:ObjectId(companyId),
    draftFlag:1, 
    activeFlag:1},
      {Name:1,courseImg:1,courseDetails:1}).skip(searchRange).limit(12).toArray();
      
 courseCount=db.clnCourses.find({'Branches':searchKey,
    companyId:ObjectId(companyId),
    draftFlag:1, 
    activeFlag:1},
      {Name:1,courseImg:1,courseDetails:1}).skip(searchRange).limit(13). count(true); 
      break;   
      case 'Tags' :
       courses= db.clnCourses.find({'Tags.text':searchKey,
    companyId:ObjectId(companyId),
    draftFlag:1, 
    activeFlag:1},
      {Name:1,courseImg:1,courseDetails:1}).skip(searchRange).limit(12).toArray();
      
 courseCount=db.clnCourses.find({'Tags.text':searchKey,
    companyId:ObjectId(companyId),
    draftFlag:1, 
    activeFlag:1},
      {Name:1,courseImg:1,courseDetails:1}).skip(searchRange).limit(13). count(true); 
      break; 
      case 'Delivery':
        if( searchKey=='online'){
           courses= db.clnCourses.find({'Delivery.online':true,
    companyId:ObjectId(companyId),
    draftFlag:1, 
    activeFlag:1},
      {Name:1,courseImg:1,courseDetails:1}).skip(searchRange).limit(12).toArray();
      
 courseCount=db.clnCourses.find({'Delivery.online':true,
    companyId:ObjectId(companyId),
    draftFlag:1, 
    activeFlag:1},
      {Name:1,courseImg:1,courseDetails:1}).skip(searchRange).limit(13). count(true); 
       break;       
        }else{
         courses= db.clnCourses.find({'Delivery.offline':true,
    companyId:ObjectId(companyId),
    draftFlag:1, 
    activeFlag:1},
      {Name:1,courseImg:1,courseDetails:1}).skip(searchRange).limit(12).toArray();
      
 courseCount=db.clnCourses.find({'Delivery.offline':true,
    companyId:ObjectId(companyId),
    draftFlag:1, 
    activeFlag:1},
      {Name:1,courseImg:1,courseDetails:1}).skip(searchRange).limit(13). count(true); 
       break;         
        } 
      
     }  
     
   }else{ 
   courses= db.clnCourses.find({$text:{$search:searchKey},
    companyId:ObjectId(companyId),
    draftFlag:1, 
    activeFlag:1},
      {Name:1,courseImg:1,courseDetails:1}).skip(searchRange).limit(12).toArray();
      
 courseCount=db.clnCourses.find({$text:{$search:searchKey},
    companyId:ObjectId(companyId),
    draftFlag:1, 
    activeFlag:1},
      {Name:1,courseImg:1,courseDetails:1}).skip(searchRange).limit(13). count(true); 
  }    
 }else{
       courses= db.clnCourses.find({
    companyId:ObjectId(companyId),
    draftFlag:1, 
    activeFlag:1},
      {Name:1,courseImg:1,courseDetails:1}).skip(searchRange).limit(12).toArray();
      
 courseCount=db.clnCourses.find({
    companyId:ObjectId(companyId),
    draftFlag:1, 
    activeFlag:1},
      {Name:1,courseImg:1,courseDetails:1}).skip(searchRange).limit(13). count(true); 
    }
             
    return {courses:courses,courseCount:courseCount}
}});



