db.system.js.save(
	{
		_id:"function_retrieve_plans",
		value:function()
		{
				plans=db.clnBillingPlan.find({activeFlag:1}).toArray();
				return plans;

	}});
