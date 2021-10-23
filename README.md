# tailoredvault.com
### Files Vault, Upload and share files
---
### Source Code at https://github.com/Favilar94/tailoredvault.com
---
### API corriendo en maquina remota tailoredvault.com (ingresar con llave)

### Rutas API https://www.tailoredvault.com/api

Para token usar x-access-token header
---
#### auth  https://www.tailoredvault.com/api/auth  
##### Registrar un usuario Nuevo (No permite validar el correo, es requerido que un admin lo actualice)
post www.tailoredvault.com/api/auth/signup/
body: user_name,about,user_password,first_name,last_name,email,plan_id,rol_id,privacy_id

##### Iniciar Sesion y obtener Token
post www.tailoredvault.com/api/auth/singin/
body: user_name,about,user_password

---
#### files https://www.tailoredvault.com/api/files
##### Subir Archivos, el usuario tiene que tener permisos de escritura
post https://www.tailoredvault.com/api/files/
body: description, privacyID, file

##### Recibir archivo, se hace una validacion de la privacidad del archivo
get  https://www.tailoredvault.com/api/files/:fileID

##### Recibe todos los archivos de un usuario, se entregan los archivos que pueda ver el usuario que los solicita
get https://www.tailoredvault.com/api/files/user/:userID

##### Actializa informacion de archivo, se valida que sea el dueño o Admin
put https://www.tailoredvault.com/api/files/:fileID
body: description, privacyID

##### Elimina archivo, se valida que sea el dueño o Admin
delete https://www.tailoredvault.com/api/files/:fileID


---
#### user https://www.tailoredvault.com/api/user
##### Crea usuario, se tiene que ser admin
post https://www.tailoredvault.com/api/user/
body: user_name,about,user_password,first_name,last_name,email,email_validated,plan_id,rol_id,privacy_id

##### Recibir informacion de todos los usuarios, se tiene que ser admin para ver todos los demas roles recibiran info publica 
get  https://www.tailoredvault.com/api/user/

##### Recibe informacion de un usuario, se revisa privacidad de usuario
get https://www.tailoredvault.com/api/user/:UserID

##### Actualiza informacion de usuario, se valida que sea el dueño o Admin (solo admin puede cambiar email_validated,plan_id,rol_id)
put https://www.tailoredvault.com/api/user/:UserID
body: about,first_name,last_name,email_validated,plan_id,rol_id,privacy_id

##### Elimina usuario, se valida que sea el dueño o Admin
delete https://www.tailoredvault.com/api/user/:UserID

---
#### relationships https://www.tailoredvault.com/api/relation/
##### Crea relacion entre usuarios, se tiene que ser admin o que uno de los dos sea parte de la relacion (solo admin puede insertar status, true or false)
post https://www.tailoredvault.com/api/relation/
body: user_ID1,user_ID2,status

##### Recibir amistades de usuario, revisa politicas de privacidad 
get  https://www.tailoredvault.com/api/relation/user/:userID

##### Actualiza amistad, se debe ser admin (esto pensando que el server debe de validar que el otro usuario acepto ser amigo)
put https://www.tailoredvault.com/api/relation/:UserID
body: status

##### Elimina amistad, se valida que sea el dueño o Admin
delete https://www.tailoredvault.com/api/relation/:UserID





