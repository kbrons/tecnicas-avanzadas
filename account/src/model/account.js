class Account {
    constructor({name, key, requestLimit = -1, isAdmin = false }) {
        if(!key) {
            throw new Error('A key is required');
		}
		
		if(!Number.isInteger(requestLimit)) {
			throw new Error('The request limit must be a number');
		}
        
        this.key = key;
        this.name = name;
		this.isAdmin = isAdmin;
		this.requestLimit = requestLimit;
    }
}

module.exports = Account;
