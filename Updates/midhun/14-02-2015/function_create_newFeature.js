db.system.js.save(
	{
		_id:"function_create_newFeature",
		value:function(newFeature)
		{
				newFeature.createdDate=Date();
				newFeature.updatedDate=Date();
				newFeature.activeFlag=1;
				companyId=db.clnFeatures.insert(newFeature);

	}});