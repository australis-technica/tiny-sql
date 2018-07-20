
    npm run build && export DEBUG='australis/tiny-sql:*' && npm test && npm tun build

    Test: 

    add ./secrets/connection-config.json before running tests

    connection-config.json: 

        { 
            "server": "localhost",
            "userName": "sa",
            "password": "supersecret",
            "options": {
                "database": "testdb",
                "encrypt": false
            }
        }