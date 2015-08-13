db.system.js.save({
	_id:"fnInsertBranches",
	value:function(cmp_id ,branches) {
	if(db.clnBranches.find({companyId:cmp_id}).count()){
        	db.clnBranches.update({companyId:cmp_id}, {$set:{branches:branches}});
	}
	else{
        db.clnBranches.insert({companyId:cmp_id,branches:branches});
	}
    	return db.clnBranches.find({companyId:cmp_id}).toArray();
}});
