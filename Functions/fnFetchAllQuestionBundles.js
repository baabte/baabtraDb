//fnFetchAllQuestionBundles

db.system.js.save({_id: "fnFetchAllQuestionBundles",
      value: function (data) {
      	var result =db.clnQuestionBank.find({companyId:ObjectId(data.companyId),activeFlag:1}).toArray();
      	for (var index in result){
      		result[index]._id=result[index]._id.valueOf();
      	}
      	return result;

}});