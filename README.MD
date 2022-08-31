## Clipboard Health


test task by Egor Kuznetski

for run app use `docker-compose up`, all deps will be installed automatically  
for tests use `yarn run test`

in `./postman_collection.json` file you can find Postman collection which i used for testing


POST and DELETE requests accept `x-www-form-urlencoded`

Users should be logged in to be able to access protected routes.
after login request, if credentials are correct, API will return set-cookie header, a cookie will be set and all future requests will pass this auth cookie, if cookie does not exist, or expired user will get 'unauthorised' error in response

### Routes:
- protected, available **only to authorised** users:
  - POST `http://localhost:4000/api/v1/employee` - add a new record, accept object, eg:
  ```javascript 
  { name:"Michael", 
    salary:20000, 
    currency:"USD", 
    department:"Engineering", 
    sub_department:"Payments" }
  ```
  - DELETE `http://localhost:4000/api/v1/employee` - delete record, accept object, eg:
  ```javascript 
  { name: "Michael" }
  ```
  

- public, available **to all** users: 
  - POST `http://localhost:4000/api/v1/login` - authorisation, accept object, eg:
   ```javascript 
  { username:"user1", 
    password:"password1" }
  ```
  - GET `http://localhost:4000/api/v1/salaryStat` - fetch SS for salary over the entire dataset
  - GET `http://localhost:4000/api/v1/salaryStat?filterby=onContract` - fetch SS for salary for records which satisfy "on_contract": "true"
  - GET `http://localhost:4000/api/v1/salaryStat?groupby=department` - fetch SS for salary for each department
  - GET `http://localhost:4000/api/v1/salaryStat?groupby=subdepartment` - fetch SS for salary for each department and sub-department combination


   query params can be mixed, eg `http://localhost:4000/api/v1/salaryStat?filterby=onContract&groupby=subdepartment`


----

some implementations are simplified, because this is test task i would be happy to explain implementation for production project

tests are simplified. in real project for test environment we have to use mocked data and mocked DB response, for dev env - test DB, for production - production DB

i simulated fetching from DB, but in real project conditions should be more specified to handle DB errors. 
for example deleting from DB should check that user exists and if not exists return error, in my implementation i skipped this check.

.env file should be ignored by gitignore, but i added because this is test task
