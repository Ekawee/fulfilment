Fulfilment
===================

This is a do testing from <a href="https://github.com/PandaMaru/backend-test-1?fbclid=IwAR2wopxdOgsKazkclS-Xnaq0dyuSCJUdb4LAdITMiNssB5_qu43wFnPPxOc">[MyCloudFulfillment] Backend Developer(Node.js) Test</a>

Usage
-------------
#### Start Service
There are 2 containers to run up. One for warehouse service and another one for database.
```
$ docker-compose up warehouse
```

#### Down Service
```
$ docker-compose down
```

#### API Access
```
http://localhost:9000/api/0.0.1/
```

#### API
```
GET   /deposit-receipts
GET   /dispatch-receipts
POST  /inventory/deposit
POST  /inventory/dispatch/price
POST  /inventory/dispatch
PUT   /inventory/dispatch
GET   /deposit-receipt/{id}/inventories
GET   /dispatch-receipt/{id}/inventories
GET   /inventory/{id}
GET   /inventory/{id}/audit
GET   /inventoryType/{id}
POST  /payment/deposit
GET   /report/profit
```
> **Tip:** Check it out the payload at online API document <a href="http://localhost:9000/api/0.0.1/api-docs" target="_blank">here</a>

> **Tip:** Or you can use postman script from <a href="https://drive.google.com/open?id=1tV8C2ftcvvR2bprJGbJs0z4MBg7LI1Ul" target="_blank"> here</a>


#### Database Access
```
POSTGRES_USER: 'api'
POSTGRES_PASSWORD: 'api'
POSTGRES_DB: 'fulfilment'
POSTGRES_HOST: localhost
POSTGRES_PORT: 5001
```

#### Unit test
```
$ npm run unit-test
```

ER Diagram
-------------
![Image](http://lplaikhum.com/test/MyCloudFulfillment.jpg)
> **Note:**
> - Designed from microservices concept.
> - Currently, payment service didn't implement yet. Because I want to focus on warehouse service as following requirement. However, payment service are place in warehouse service just for temporary.

Roadmap
-------------
As my concept there are many thing todo. You can see pending features from <a href="https://trello.com/b/R3iLgpnr/mycloudfulfillment" target="_blank">trello board</a>
