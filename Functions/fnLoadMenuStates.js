db.system.js.save({_id: "fnLoadMenuStates",
		value: function (id) 
{
var results= db.clnMenuMaster.find({_id:ObjectId(id)},{actions:1}).toArray();
    return results;

}});

