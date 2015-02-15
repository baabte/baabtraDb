db.system.js.save(
	{
		_id:"fnLoadProfile",
		value:function(UserRoleMappingobjid)
		{
				profile=db.clnUserRoleMapping.find({_id:ObjectId(UserRoleMappingobjid)},{profile:1});
				return profile;

	}});
