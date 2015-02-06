/*
Created by : Jihin
Created On : 04/02/2015
Purpose : For remove course element from course timeline
*/

function(courseId, courseElemName, tlPoint, index, rmId) {
    
    var key="courseTimeline."+tlPoint+"."+courseElemName;
    var obj={};
    obj[key]=index;
    db.clnCourses.update({_id:courseId},{$pop:obj});
    var a =db.clnCourses.findOne({_id:courseId});
    if(!a.courseTimeline[tlPoint][courseElemName].length){
        b = a.courseTimeline[tlPoint][courseElemName];
        var unset={};
        unset[key]=1;
        db.clnCourses.update({_id:courseId},{$unset:unset});
        a = db.clnCourses.findOne({_id:courseId});
        if(Object.keys(a.courseTimeline[tlPoint]).length == 0){
            unset={};
            unset["courseTimeline."+tlPoint]=1;
            db.clnCourses.update({_id:courseId},{$unset:unset});
            b=unset;
        }
    }
    return "courseTimeline."+tlPoint;
}
