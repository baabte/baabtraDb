db.system.js.save({_id: "fnLoadBranches",
	value : function (cmp_id) {
		var branches = db.clnBranches.find({companyId:cmp_id}).toArray();
		for(var branch in branches){
			branches[branch]._id = branches[branch]._id.valueOf();
			branches[branch].crmId = branches[branch].crmId.valueOf();
            branches[branch].urmId = branches[branch].urmId.valueOf();
            branches[branch].companyId = branches[branch].companyId.valueOf();
            if(branches[branch].parent != "root"){
            	branches[branch].parent = branches[branch].parent.valueOf();
            }
            
		}
    return branches;
}});
