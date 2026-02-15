@echo off
echo Setting Heroku environment variables for btfd...
echo.

heroku config:set DATABASE_URL="mongodb+srv://courching:aPmMw3ZiBl9DXQjS@cluster0.82jxy1z.mongodb.net/btsli?retryWrites=true&w=majority&appName=Cluster0" -a btfd
heroku config:set JWT_SECRET="dev_secret_key_replace_in_production" -a btfd

echo.
echo Environment variables set successfully!
echo.
echo Restarting app...
heroku restart -a btfd

echo.
echo Done! Check your app at: https://btfd-283a411fb274.herokuapp.com/
pause
