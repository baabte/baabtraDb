var courses = db.clnUserCourseMapping.find({activeFlag:1}).toArray();
for(var course in courses){
    temp[course] = courses[course];
    courses[course].createdDate = new Date(Date.parse(courses[course].createdDate.toString()));
    db.clnUserCourseMapping.save(courses[course]);
}
