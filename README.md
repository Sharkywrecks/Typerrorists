###### Angular Frontend - Swap from SQLite to MySQL
In powershell:
$env:ASPNETCORE_ENVIRONMENT = "Production"    ...dont forget to set to development
Delete Migrations folders and databases
dotnet ef migrations add "MySQL Initial" -p Infrastructure -s API -c VoterContext -o Data/Migrations
dotnet ef migrations add "MySQL Identity Initial" -p Infrastructure -s API -c AppIdentityDbContext -o Identity/Migrations

###### To publish:
ng build
dotnet clean
dotnet build --configuration Release
dotnet publish -c Release -o publish voting_system.sln

command >reload deploy reload package

$env:ASPNETCORE_ENVIRONMENT = "Development"

Go to digitalocean droplet console and enter ls /var/voting_system/
to check if deployment successful

#### Digital Ocean
###### To add site
sudo nano /etc/apache2/sites-available/voting-system.conf
Add required contents to file then
  
###### To add webservice:
sudo nano /etc/systemd/system/voting-system-web.service
Add required contents to file then
sudo systemctl enable voting-system-web.service
Then start service
sudo systemctl start voting-system-web.service
sudo systemctl status voting-system-web.service

###### If webservice already running:
sudo systemctl restart voting-system-web.service

###### To disable webservice:
sudo systemctl stop voting-system-web.service
sudo systemctl disable voting-system-web.service

###### To certify (https)
sudo certbot --apache -d voting.oceancsoftware.cloud

###### Logs - DigitalOcean
sudo journalctl -u voting-system-web.service --since "1 minute ago"

##### Adding new migration - Database
dotnet ef migrations add InitialCreate -p Infrastructure -s API -o Data/Migrations -c VoterContext
dotnet ef migrations add IdentityInitial -p Infrastructure -s API -o Identity/Migrations -c AppIdentityDbContext