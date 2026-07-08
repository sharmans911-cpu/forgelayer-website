@echo off
echo Setting up LayerForge website folder structure...

:: Create admin folder
if not exist "admin" mkdir admin
if not exist "images" mkdir images
if not exist "images\uploads" mkdir images\uploads

:: Move admin files into place
if exist "admin-index.html" (
    move /Y "admin-index.html" "admin\index.html"
    echo Moved admin-index.html to admin\index.html
)
if exist "admin-config.yml" (
    move /Y "admin-config.yml" "admin\config.yml"
    echo Moved admin-config.yml to admin\config.yml
)

echo.
echo Done! Your folder structure is now:
echo.
echo   layerforge-website\
echo   ├── index.html         (your website)
echo   ├── content.json       (all your site content)
echo   ├── admin\
echo   │   ├── index.html     (admin login page)
echo   │   └── config.yml     (admin panel config)
echo   └── images\
echo       └── uploads\       (your gallery photos go here)
echo.
echo Next step: Upload this whole folder to GitHub, then deploy on Netlify.
echo See the instructions Claude gave you in the chat.
echo.
pause
