/*
Created by : Jihin
Created On : 04/02/2015
Purpose : For save course element from course timeline
*/
db.system.js.save({_id: "fnSaveCourseElementFields",
		value: function(element) {
    db.clnCourseElementFields.save(element);
    var response = {};
    if(element._id == undefined){
        response.msg ="Course Element Field Added Successfully";
    }
    else{
        response.msg ="Course Element Field Updated Successfully";
    }
    response.data = db.eval("fnGetCourseElementFields()");
    return response;
}});
