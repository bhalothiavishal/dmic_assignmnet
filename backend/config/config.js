module.exports = {
    'appPath': process.env.WEB_HOST,  
    'apiPath': process.env.API_PATH, 
    'lspWebAppPath': '',
    'adminWebAppPath': '',
    'secret': 'supersecret',
    defaultPage: 1,
    defaultPageSize: 10,
    expiryTimeOut: '7 days',
    signOptions: {
        issuer: 'Dminc',
        subject: 'Dminc',
        audience: 'Dminc.com',
        expiresIn: "84h",
        algorithm: "RS256"
    },    
    status: [
        'active',
        'inactive',
        'deleted',
    ],
};

