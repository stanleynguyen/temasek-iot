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
