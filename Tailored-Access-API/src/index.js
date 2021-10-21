import app from './app'
import './database'

app.listen(app.get('port'), () => {
    console.log('Server Listening on port ', app.get('port'));
});
