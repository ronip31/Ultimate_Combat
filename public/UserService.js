

class UserService {
    constructor() {
        this.userId = null;
    }

    setUserId(userId) {
        this.userId = userId;
    }

    getUserId() {
        return this.userId;
    }
}

// Exporte uma instância da classe para ser utilizada em outros arquivos
const userService = new UserService();
export default userService;
