###

### How to start app at local

- Install dependencies: `npm install`
- Run postgres by docker: `docker-compose up -d`
- Init database
```
npm run build
npm run migration:run
```
- Start backend server: `npm run start`
- Then you can use postman to test APIs
