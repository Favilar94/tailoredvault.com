# tailoredvault.com
### Files Vault, Upload and share files


router.post('/signup', authCtrl.signUp);

router.post('/singin',authCtrl.signIn);

### Rutas API
#### auth  www.tailoredvault.com/api/auth 
Crea un usuario Nuevo
post www.tailoredvault.com/api/auth/signup  
body: user_name,about,user_password,first_name,last_name,email,plan_id,rol_id,privacy_id
post www.tailoredvault.com/api/auth/singin
#### files www.tailoredvault.com/api/files
#### relationships www.tailoredvault.com/api/relation
#### user www.tailoredvault.com/api/user



