mapping=db.clnCourseBatchMapping.find().toArray();
count=0;
while(count<mapping.length){
mapping[count].courseName=db.clnCourses.findOne({_id:mapping[count].fkCourseId}).Name;
db.clnCourseBatchMapping.save(mapping[count]);
count++;
} 
