# temasek-iot

## endpoints

### admin endpoints

admin credentials for basic auth:

username: admin

password: password

__get all Companies__
```
GET /api/admin/company/all
```

__create a new Company__
```
POST /api/admin/company 
{ name: { type: string } }
```

__delete a Company__
```
DELETE /api/admin/company/<id of the company>
```

__get all Organisers__
```
GET /api/admin/organiser/all
```

__create a new Organiser__
```
POST /api/admin/organiser
{
  email: { type: string, unique: true },
  password: { type: string },
  company_id: { type: integer, reference: Companies(id) }
}
```

__get a single Organiser__
```
GET /api/admin/organiser/<id of the organiser>
```

__delete a single Organiser__
```
DELETE /api/admin/organiser/<id of the organiser>
```

### organiser endpoints 

__authentication__
```
# just send this request with correct credentials, a sesssion will be automatically created

#login
POST /api/organiser/authenticate/login
{
  username: { type: string },
  password: { type: string }
}
```

__get list of all voters__
```
GET /api/organiser/voter/all
```

__get list of unverified voters__
```
GET /api/organiser/voter/unverified
```

__add a voter to an event__ 
```
POST /api/organiser/voter/join
{
  voterId: { type: int },
  eventId: { type: int }
}
```

__get single voter__
```
GET /api/organiser/voter/<id of the voter>
```

__activate voter's account__
```
POST /api/organiser/voter/<id of the voter>
```

__delete voter__
```
DELETE /api/organiser/voter/<id of the voter>
```

__get all events__
```
GET /api/organiser/event/all
```

__get single event__ 
```
GET /api/organiser/event/<id of the event>
```

__create new event__ 
```
POST /api/organiser/event
{
  name: { type: string }
}
```

__edit event___
```
PUT /api/organiser/event/<id of the event>
{
  name: { type: string }
}
```

__start an event__
```
POST /api/organiser/event/<id of the event>/start
```

__end an event__
```
# event must be started before it can be ended

POST /api/organiser/event/<id of the event>/end
```

__delete an event__ 
```
DELETE /api/organiser/event/<id of the event>
```

__create a question__
```
POST /api/organiser/question
{
  eventId: { type: int, reference: event.id },
  question: { type: string },
  choices: [ { type: string } ]
}
```

### voter endpoints

__registration__
```
POST /api/voter/register
{
  name: { type: string },
  nric: { type: string, unique: true },
  country_code: { type: integer },
  phone: { type: integer },
  email: { type: string },
  shares: { type: string }
}
```

__get registration code__
```
POST /api/voter/getcode
{
  countryCode: { type: integer },
  phone: { type: integer }
}
```

__verify registration phone number__
```
POST /api/voter/verify-reg
{
  countryCode: { type: integer },
  phone: { type: integer },
  verifyCode: { type: integer }
}
```
