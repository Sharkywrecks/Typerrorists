###### Angular Frontend - Swap from SQLite to MySQL
In powershell:
$env:ASPNETCORE_ENVIRONMENT = "Production"
Delete Migrations folders and databases
dotnet ef migrations add "MySQL Initial" -p Infrastructure -s API -c BrainContext -o Data/Migrations
dotnet ef migrations add "MySQL Identity Initial" -p Infrastructure -s API -c AppIdentityDbContext -o Identity/Migrations

###### To publish:
ng build
dotnet clean
dotnet build --configuration Release
dotnet publish -c Release -o publish Typerrorists.sln

command >reload deploy reload package

$env:ASPNETCORE_ENVIRONMENT = "Development"

Go to digitalocean droplet console and enter ls /var/typerrorists/
to check if deployment successful

#### Digital Ocean
###### To add site
sudo nano /etc/apache2/sites-available/typerrorists.conf
Add required contents to file then
  
###### To add webservice:
sudo nano /etc/systemd/system/typerrorists-web.service
Add required contents to file then
sudo systemctl enable typerrorists-web.service
Then start service
sudo systemctl start typerrorists-web.service
sudo systemctl status typerrorists-web.service

###### If webservice already running:
sudo systemctl restart typerrorists-web.service

###### To disable webservice:
sudo systemctl stop typerrorists-web.service
sudo systemctl disable typerrorists-web.service

###### To certify (https)
sudo certbot --apache -d typerrorists.oceancsoftware.cloud

###### Logs - DigitalOcean
sudo journalctl -u typerrorists-web.service --since "1 minute ago"

##### Adding new migration - Database
dotnet ef migrations add InitialCreate -p Infrastructure -s API -o Data/Migrations -c BrainContext
dotnet ef migrations add IdentityInitial -p Infrastructure -s API -o Identity/Migrations -c AppIdentityDbContext