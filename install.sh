echo "Installig NGINX"
sudo apt-get update 1>/dev/null
sudo apt-get install -y nginx 1>/dev/null

echo "Installig website"
sudo cp -r flame /var/www/
sudo rm -f /etc/nginx/sites-enabled/default
sudo cp -f flame.conf /etc/nginx/conf.d/
sudo nginx -t -q || exit 1
sudo systemctl restart nginx