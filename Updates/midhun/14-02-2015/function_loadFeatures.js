db.system.js.save(
	{
		_id:"function_loadFeatures",
		value:function()
		{
				features=db.clnFeatures.find().toArray();
				return features;

	}});

