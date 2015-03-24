db.system.js.save({_id: "fnLoadMenuNames",
		value: function () 
{
var results=  db.clnMenuMaster.find({},{MenuName:1,actions:1,MenuLink:1}).toArray();
  
  return results;

}});

