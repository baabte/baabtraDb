//fnbaabtraProfileData funtion to retrieve needed for profile
db.system.js.save({_id: "fnbaabtraProfileData",
      value: function (data) { 
		var returnData={};
		returnData.coursedata=db.clnUserCourseMapping.findOne({ "fkUserLoginId" : ObjectId(data)},{Name:1,courseImg:1,totalMark:1,markScored:1})
		return returnData;

}}); 