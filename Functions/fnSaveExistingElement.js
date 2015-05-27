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