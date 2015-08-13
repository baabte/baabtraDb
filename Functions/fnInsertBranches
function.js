db.system.js.save({
	_id:"fnInsertBranches",
	value:function(cmp_id ,branches, rmId) {
        try{
            if(!branches._id){
                branches._id = new ObjectId();
                branches.createdDate = Date();
                branches.updatedDate = Date();
                branches.crmId = ObjectId(rmId);
                branches.urmId = ObjectId(rmId);
                branches.companyId = ObjectId(cmp_id);
                branches.activeFlag = 1;
            }
            else{
                branches._id = ObjectId(branches._id);
            	branches.updatedDate = Date();
            	branches.urmId = ObjectId(rmId);
            	branches.crmId = ObjectId(branches.crmId);
            	branches.companyId = ObjectId(branches.companyId);
            }
            if(branches.parent != "root"){
                branches.parent = ObjectId(branches.parent);
                var parent = db.clnBranches.findone({_id:branches.parent});
                if(parent.children.indexOf(branches._id) == -1){
                    parent.children.push(branches._id);
                    parent.updatedDate = Date();
                    parent.urmId = ObjectId(rmId);
                    db.clnBranches.save(parent);
                }
            }
            
            db.clnBranches.save(branches);
            if(branches.parent != "root"){
                branches.parent = branches.parent.valueOf();
            }
            branches._id = branches._id.valueOf();
            branches.crmId = branches.crmId.valueOf();;
            branches.urmId = branches.crmId.valueOf();;
            branches.companyId = branches.companyId.valueOf();;

			return branches;
		}
		catch(err){
			return "Error";
		}
	}
}); 
