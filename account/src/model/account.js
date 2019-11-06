class Account {
    constructor({name, key, requestLimit = -1, isAdmin = false }) {
        if(!key) {
            throw new Error('A key is required');
        }

        if(!name) {
            throw new Error('A name is required');
		}
        
        this.key = key;
        this.name = name;
		this.isAdmin = isAdmin;
		this.requestLimit = requestLimit;
    }
}

module.exports = Account;
