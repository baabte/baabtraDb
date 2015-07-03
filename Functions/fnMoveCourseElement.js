
/*
Creted By : Jihin Raju
Date : 08/06/2015
Purpose: For move course elements
*/

db.system.js.save({
    "_id" : "fnMoveCourseElement",
    "value" : function(moveObject) {
        var course = db.clnCourses.findOne({_id:ObjectId(moveObject.courseId)});
        var fromElementArray = moveObject.elementFrom.split('.');
        var toElementArray = moveObject.elementTo.split('.');
        //var moveElement = course.courseTimeline[];
        var order = 0;
        var gotOrderFlag = false;
        var moveElement = course.courseTimeline;
        var getLoop = {};

        for(var elem in fromElementArray){
            //element to move
            moveElement = moveElement[fromElementArray[elem]];
        }

        var syllabusArray = moveElement.syllabus.key.split('.');
        var moveElementSyllabus = course.syllabus;

        for(var syllabus in syllabusArray){
            //element to be moved
            moveElementSyllabus = moveElementSyllabus[syllabusArray[syllabus]];
        }
            
        //calculting the point to add the element
        if(moveObject.addType == "new"){
            for(var tmpOrder in course.elementOrder){
                var orderKeys = course.elementOrder[tmpOrder].split(".");
                orderKeys[0] = parseInt(orderKeys[0]);
                tlPoint = parseInt(toElementArray[0]);
                tmpOrder = parseInt(tmpOrder);
                
                if (orderKeys[0] == tlPoint){
                    gotOrderFlag = true;
                    order = tmpOrder + 1 > order ? tmpOrder + 1 : order;
                    }
                
                if ((!gotOrderFlag) && (orderKeys[0] < tlPoint)) {
                    order = tmpOrder + 1 > order ? tmpOrder + 1 : order;
                }
                
               }
        }
        else if(moveObject.addType == "Above"){
            
        }

           if(moveElement.order < order){
            order=order-1;
           }
                
        
           var copyOfElementOrder = JSON.parse(JSON.stringify(course.elementOrder));
           for(var orderTemp in copyOfElementOrder){
                
                orderTemp = parseInt(orderTemp);
                var editElementOrderArray = copyOfElementOrder[orderTemp].split('.');
            
               if(orderTemp >= order && orderTemp < moveElement.order){
                    var editElement = course.courseTimeline[editElementOrderArray[0]][editElementOrderArray[1]][editElementOrderArray[2]];
                    editElement.order = editElement.order + 1;
                    course.elementOrder[orderTemp+1] = copyOfElementOrder[orderTemp];
                }
                else if(orderTemp > moveElement.order && order > orderTemp){
                    var editElement = course.courseTimeline[editElementOrderArray[0]][editElementOrderArray[1]][editElementOrderArray[2]];
                    editElement.order = editElement.order - 1;
                    course.elementOrder[orderTemp-1] = copyOfElementOrder[orderTemp];
                }
              
                if(orderTemp == parseInt(moveElement.order)){
                     course.courseTimeline[editElementOrderArray[0]][editElementOrderArray[1]].splice(editElementOrderArray[2],1);
                     if(!course.courseTimeline[editElementOrderArray[0]][editElementOrderArray[1]].length){

                        delete course.courseTimeline[editElementOrderArray[0]][editElementOrderArray[1]];
                        if(!Object.keys(course.courseTimeline[parseInt(editElementOrderArray[0])]).length){
                            getLoop[order] = parseInt(editElementOrderArray[0]);
                            //delete course.courseTimeline[parseInt(editElementOrderArray[0])];
                        }
                     }
                }
            }//course.elementOrder - end
            

            
           
            moveElement.order = order;
            moveElement.index = parseInt(toElementArray[2]);
            moveElement.tlPointInMinute = parseInt(toElementArray[0]);
            //var tempTlpoint = course.courseTimeline;
           if(moveObject.addType == "new"){
                course.courseTimeline[toElementArray[0]] = {};
                course.courseTimeline[toElementArray[0]][moveElement.Name] = [];
                course.courseTimeline[toElementArray[0]][moveElement.Name].push(moveElement);
                //course.courseTimeline = tempTlpoint;
            }
            //delete element from old position
            delete course.elementOrder[moveElement.order];

            //splicing the element refernce from syllabus
            moveElementSyllabus.element.splice(moveElementSyllabus.element.indexOf(moveObject.elementFrom),1);
            moveElementSyllabus.element.push(moveObject.elementTo);
            course.elementOrder[order] = moveObject.elementTo;

            //changing all other fields data
            var selectedTlPoint = course.courseTimeline[fromElementArray[0]][fromElementArray[1]]
            for(var elem in selectedTlPoint){
                if(parseInt(fromElementArray[2]) <= elem){
                    selectedTlPoint[elem].index = parseInt(elem);
                    var tempSyllabusArray = selectedTlPoint[elem].syllabus.key.split(".");
                    var tempElementSyllabus = course.syllabus;
                    for(var tempSyll in tempSyllabusArray){
                        tempElementSyllabus = tempElementSyllabus[tempSyllabusArray[tempSyll]];
                    }

                    var syllabusIndex = tempElementSyllabus.element.indexOf(course.elementOrder[selectedTlPoint[elem].order]);
                    
                    var tempElementOrder = course.elementOrder[selectedTlPoint[elem].order].split('.');
                    tempElementOrder[2] = elem;
                    course.elementOrder[selectedTlPoint[elem].order] = tempElementOrder[0]+'.'+tempElementOrder[1]+'.'+tempElementOrder[2];

                    tempElementSyllabus.element[syllabusIndex] = course.elementOrder[selectedTlPoint[elem].order];

                    var tempElementOrder = course.elementOrder[selectedTlPoint[elem].order].split('.');
                    tempElementOrder[2] = elem;
                    course.elementOrder[selectedTlPoint[elem].order] = tempElementOrder[0]+'.'+tempElementOrder[1]+'.'+tempElementOrder[2];
                    
                }
            }
            //db.clnCourses.save(course);
            return {courseTimeline:course.courseTimeline,elementOrder:course.elementOrder};
         }
     })
