 // fnSaveExistingElement

db.system.js.save({
    "_id" : "fnSaveExistingElement",
    "value" : function (data) {
    	for(var index in data.courseElements){
    		var Element=data.courseElements[index];
    		var searchKey='courseTimeline.'+Element.courseElement.key;
			var courseType=db.clnCourses.distinct(searchKey,{_id:ObjectId(Element.courseId)});
			Element.courseElement[Element.courseElement.key].index=courseType.length;
    	var elementOrder=fnAddCourseTimelineElement(ObjectId(Element.courseId),Element.courseElement);

    	}
    	

    	
    return elementOrder;

}});


//fnExistingMaterialsFetch

db.system.js.save({_id:'fnExistingMaterialsFetch',
value:function(data) {
  var companyId=ObjectId(data.companyId);

  var ExistingMaterials=db.clnCourses.find({companyId:companyId,activeFlag:1,courseTimeline:{$exists:1},type:'course'},{courseTimeline:1,Name:1,Duration:1,draftFlag:1,syllabus:1}).toArray();

    return ExistingMaterials;

}});