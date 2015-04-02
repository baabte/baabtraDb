//fnfetchCourseList
db.system.js.save({_id: "fnfetchCourseList",
      value: function (courseFetchData) {
    var companyId=ObjectId(courseFetchData.fkcompanyId);

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


    var courselist = db.clnCourses.find({_id:{$in:coursesArray},
                          companyId:{$in:providerArray},draftFlag:1, activeFlag:1}, {_id:1, Name:1}).toArray();
    return courselist;
}});