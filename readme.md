tiny ms-sql tools

Install:

    npm i @australis/tiny-sql

    yarn add @australis/tiny-sql

Or individual packages

- @australis/tiny-sql-batch-script  
- @australis/tiny-sql-connect  
- @australis/tiny-sql-connection-config  
- @australis/tiny-sql-connection-factory  
- @australis/tiny-sql-connection-string-parse  
- @australis/tiny-sql-exec-sql  
- @australis/tiny-sql-params  
- @australis/tiny-sql-scripts  


Usage:  
see tests

Scripts:

set-version:  
| sets packages/**/packkage.json#version from root package.json#version,  
also in lerna.json (just in case)

set-private:  
| sets ./package.json#private=value where value true|false