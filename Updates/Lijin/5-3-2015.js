//elementOrder:{1:'1440.youtubeVideo.2'}

//
db.system.js.save({_id:'fnAddCourseTimelineElement',
value:function (courseId, courseElement) {
    var keyArray = courseElement.key.split(".");
    var tlPoint = keyArray[0];
    var elemType = keyArray[1];
    var key = "courseTimeline." + courseElement.key;
    var obj = {};
    obj[key] = courseElement[courseElement.key];
    db.clnCourses.update({_id:courseId}, {$push:obj});
    var course = db.clnCourses.find({_id:courseId}).toArray();
    var elements = courseElement[courseElement.key].elements;
    var innerIndex = course[0].courseTimeline[tlPoint][elemType].length - 1;
    var order = -1;
	

	for(tmpOrder in course[0].elementOrder){
		var orderKeys=course[0].elementOrder[tmpOrder].split('.');
		if(orderKeys[0]==tlPoint){
			order=tmpOrder>order?tmpOrder:order;	
		}
	}
	order=(order*1);
	var previousElem = tlPoint+'.'+elemType+'.'+innerIndex;
	for(curOrder in course[0].elementOrder){
		curOrder=(curOrder*1);
     if(curOrder>=order){
     				 var elemToCopy=previousElem;
     				 previousElem=course[0].elementOrder[curOrder+1];
                     
                     
                      if(typeof elemToCopy != 'undefined'){
                      	 var keyArr=elemToCopy.split('.');
	                     var tmpTlPoint=keyArr[0];
	                     var elementName=keyArr[1];
	                     var elemIndex=keyArr[2];
                         course[0].courseTimeline[tmpTlPoint][elementName][elemIndex].order=curOrder+1;
                         course[0].elementOrder[curOrder+1]=elemToCopy;    
                      }
     }    
    }
    if (!course[0].elementOrder) {
        course[0].elementOrder = {};
    }

    var totalMark = 0;
    var looper = 0;
    var currentMark = 0;
    var tlPointMark = 0;
    if (course[0].courseTimeline[tlPoint].totalMark) {
        tlPointMark = course[0].courseTimeline[tlPoint].totalMark;
    }
    if (course[0].totalMark) {
        currentMark = course[0].totalMark;
    }
    for (looper; looper < elements.length; looper++) {
        if (elements[looper].type == "question-viewer" || elements[looper].type == "question-group-viewer") {
            totalMark = totalMark + elements[looper].value.mark.totalMark;
        }
    }
    course[0].totalMark = currentMark + totalMark;
    course[0].courseTimeline[tlPoint].totalMark = tlPointMark + totalMark;
    db.clnCourses.save(course[0]);
    return course;}});

//


//
db.system.js.save({_id:'fnRemoveCourseElement',
value:function(courseId, courseElemName, tlPoint, index, rmId) {
    
    var key="courseTimeline."+tlPoint+"."+courseElemName;
    var obj={};
    obj[key]=index;
    var objProjection={};
        objProjection[key]=1;
        objProjection['_id']=0;
    var oldCourse=db.clnCourses.findOne({_id:courseId},objProjection);
    var removedOrder=oldCourse.courseTimeline[tlPoint][courseElemName][index].order*1;
    
    var oldElements=oldCourse.courseTimeline[tlPoint][courseElemName][index].elements;
    var markToDeduct=0;
    for(indexKey in oldElements){
        if(oldElements[indexKey].type=='question-viewer' || oldElements[indexKey].type == "question-group-viewer"){
         markToDeduct=markToDeduct+oldElements[indexKey].value.mark.totalMark;
        }
    }
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
    var course=db.clnCourses.findOne({_id:courseId});
        course.totalMark=course.totalMark-markToDeduct;
        course.courseTimeline[tlPoint].totalMark=course.courseTimeline[tlPoint].totalMark-markToDeduct;
    
    for(order in course.elementOrder){
    	order=(order*1);
     if(order>=removedOrder){
         	
         	{
         	if(course.elementOrder[order]){
                     var keyArr=course.elementOrder[order].split('.');
                     var tmpTlPoint=keyArr[0];
                     var elementName=keyArr[1];
                     var innerIndex=keyArr[2];
                      if(removedOrder!=order){
                         course.courseTimeline[tmpTlPoint][elementName][innerIndex].order=order-1;
                         course.elementOrder[order-1]=course.elementOrder[order];    
                      }
                      
                      delete course.elementOrder[order];
                  }
              }
     }    
    }
    
    
    
        db.clnCourses.save(course);
    return "courseTimeline."+tlPoint;}});
//


//
db.system.js.save({_id:'fnEditCourseElement',
value:function(courseId, courseElemName, tlPoint,elemObjToSave, rmId) {
        var innerIndex=elemObjToSave.index;
        var courseObj=elemObjToSave.element;
	var key = "courseTimeline."+tlPoint+"."+courseElemName;
	var obj = {};
	obj[key] = courseObj;
	//db.clnCourses.update({_id:courseId},{$set:obj});
        
        var course = db.clnCourses.find({_id:courseId}).toArray();
        var order = course[0].courseTimeline[tlPoint][courseElemName][innerIndex].order;
        var totalMark=0;
        var oldTotalMark=0;
        var newTotalMark=0;
        var oldElements=course[0].courseTimeline[tlPoint][courseElemName];
    var looper=0;
    if(course[0].totalMark){
      totalMark=course[0].totalMark;
    }
    for(index in oldElements){
    for(looper=0;looper<oldElements[index].elements.length;looper++){
        if(oldElements[index].elements[looper].type=='question-viewer' || oldElements[index].elements[looper].type == "question-group-viewer"){
            oldTotalMark=oldTotalMark+oldElements[index].elements[looper].value.mark.totalMark;
        }
     }    
    }


    for(looper=0;looper<courseObj.elements.length;looper++){
        if(courseObj.elements[looper].type=='question-viewer' || courseObj.elements[looper].type == "question-group-viewer"){
            newTotalMark=newTotalMark+courseObj.elements[looper].value.mark.totalMark;
        }
     }    

   var tlPointMark=0;
    if(course[0].courseTimeline[tlPoint].totalMark){
        tlPointMark=course[0].courseTimeline[tlPoint].totalMark;
    }
     
     course[0].courseTimeline[tlPoint][courseElemName][innerIndex]=courseObj;
     course[0].courseTimeline[tlPoint][courseElemName][innerIndex].order=order
     course[0].totalMark=totalMark+(newTotalMark-oldTotalMark);
     course[0].courseTimeline[tlPoint].totalMark=tlPointMark+(newTotalMark-oldTotalMark);
     db.clnCourses.save(course[0]);
        
return course}});

//



// script for adding order to course and course elements


var course=db.clnCourses.find().toArray()
var totalCourse=course.length;
var looper=0;
var fn=function(a,b){print(a+':'+b)};
for(looper;looper<totalCourse;looper++){
	delete course[looper].elementOrder;
	var order=0;
	//var tlPoints=[];
	// for(tlPointTmp in course[looper].courseTimeline){
	// 	if(typeof course[looper].courseTimeline[tlPointTmp][elemType] == 'object'){
	// 	tlPointTmp=tlPointTmp*1;
	// 	tlPoints.push(tlPointTmp);
 //                 //print(tlPoints);
	// 	}
	// }
       
	// tlPoints=tlPoints.sort(fn);
        //print(tlPoints);
	//for(arrIndex in tlPoints){
            //var tlPoint=tlPoints[arrIndex]+'';
            for(tlPoint in course[looper].courseTimeline){
		
		for(elemType in course[looper].courseTimeline[tlPoint]){
			
			if(typeof course[looper].courseTimeline[tlPoint][elemType] == 'object'){

				for(index in course[looper].courseTimeline[tlPoint][elemType]){
					if(!course[looper].elementOrder){
				        course[looper].elementOrder={};
				        course[looper].elementOrder[0]={};
				     }
				     if(!course[looper].elementOrder[order]){
				        course[looper].elementOrder[order]={};
				     }
				     
				     course[looper].elementOrder[order]=tlPoint+'.'+elemType+'.'+index;
				     course[looper].courseTimeline[tlPoint][elemType][index].order=order;
				     order++;
				}
				
			    
			     
			}
		}
	}
	db.clnCourses.save(course[looper]);	
}

//


//script for copying existing order to course mapping
var courseMappings=db.clnUserCourseMapping.find().toArray();
var crsMappingLen=courseMappings.length;
var looper=0;
	for(looper;looper<crsMappingLen;looper++){
		var courseId=courseMappings[looper].fkCourseId;
		var course=db.clnCourses.findOne({_id:courseId});
                if(course){
                    courseMappings[looper].elementOrder=course.elementOrder;
                    courseMappings[looper].courseTimeline=course.courseTimeline;
                    db.clnUserCourseMapping.save(courseMappings[looper]);
                }
	}

//






