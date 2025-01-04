export const messages = {
    jwt: {
        notFoudJwt: 'JWT_SECRET não configurado no servidor.',
        tokenMissing: 'Token não fornecido.',
        invalidToken: 'Token inválido.',
        serverError: 'Erro interno ao verificar o token.',
        errorGeneretedToken: 'Erro ao gerar token.',
        invalidOrExpiredToken: 'Token inválido ou expirado.',
        tokenProcessingError: 'Erro ao processar o token ou buscar o usuário.',
        jwTConfigurationMissing: 'Configuração do JWT está ausente. Verifique JWT_SECRET e JWT_EXPIRE_IN.'
    },
    user: {
        userIdNotFound: 'ID do usuário não encontrado no token.',
        existingUser: 'Usuário já cadastrado.',
        userNotFound: 'Usuário não encontrado.',
        ErrortryingToFindUser: 'Erro ao tentar encontrar Usuário.',
    },
    account: {
        unauthorizedAccess: 'Acesso negado.',
        internalErrorRegister: 'Erro ao tentar cadastrar usuário.',
        unauthorizedAccount: 'Falha ao efetuar login. Conta não autorizada.',
    },
    login: {
        invalidCredentials: 'Usuário ou senha incorretos.',
        invalidUserValidity: 'Credenciais inválidas.',
        loginSuccess: 'Login realizado com sucesso.',
        loginError: 'Erro ao tentar efetuar o login.',
    },
    update: {
        currentPasswordIncorrect: 'Senha atual incorreta.',
        updateFailed: 'Erro ao tentar atualizar o usuário.',
        updateSuccess: 'Usuário atualizado com sucesso.',
        emailAlreadyUpdated: 'E-mail já atualizado recentemente.',
        internalError: 'Erro interno ao tentar atualizar conta.',
    },
    delete: {
        internalError: 'Erro interno ao tentar deletar conta.',
        success: 'Usuário marcado como deletado com sucesso.',
    }
};
