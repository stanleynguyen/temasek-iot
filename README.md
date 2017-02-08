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
  email: { type: string },
  password: { type: string }
}

#logout
GET /api/organiser/authenticate/logout
```

__get list of voters__
```
GET /api/organiser/voter/all
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

__get questions__ 
```

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
