//fnExistingMaterialsFetch

db.system.js.save({_id:'fnExistingMaterialsFetch',
value:function(data) {
  var companyId=ObjectId(data.companyId);

  var ExistingMaterials=db.clnCourses.find({companyId:companyId,activeFlag:1,draftFlag,courseTimeline:{$exists:1}},{courseTimeline:1,Name:1,Duration:1}).toArray();

	return ExistingMaterials;

}});