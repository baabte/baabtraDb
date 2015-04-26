db.system.js.save({_id:'fnUpdateOrderFormStatus',
value:function(orderForm, actTransactions, paymentReceipt) {
    // write your code here
    //Created by Anoop to update the status of the order form 
    //on: 10-04-2015
    
    orderForm.updatedDate = ISODate();
    orderForm.createdDate = ISODate(orderForm.createdDate);
    
    db.clnTrainingRequest.save(orderForm);
    
    if(actTransactions != undefined) {
        
        for(var i in actTransactions) {
            var actTransaction = actTransactions[i];
            actTransaction.updatedDate = ISODate();
            actTransaction.createdDate = ISODate();
            
            db.clnActTransactions.insert(actTransaction);
        }  
        
    }
    
    if(paymentReceipt != undefined) {
    
            var codeData = {
                    'companyId' : paymentReceipt.companyId,
                    'item': 'Receipts'
                    };
                
            var customCompanyCode = fnGetCode(codeData); 
            
            paymentReceipt.updatedDate = ISODate();
            paymentReceipt.createdDate = ISODate();    
            paymentReceipt.customCompanyCode = customCompanyCode;
            db.clnpaymentReceipts.insert(paymentReceipt);    
    }
    
    return {type:'success', data:paymentReceipt};
}});
