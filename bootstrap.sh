#!/usr/bin/env bash
#
# Provisioning for CULTR boxes

apt-get update

# Install libraries, Git and Postgres
apt-get install -y build-essential
apt-get install -y git
apt-get install -y python-pip
apt-get install -y libpq-dev python-dev
apt-get install -y libssl-dev libffi-dev
apt-get install -y libxslt1-dev libxslt1.1 libxml2-dev libxml2
apt-get install -y postgresql postgresql-contrib

# Install Redis
wget http://download.redis.io/redis-stable.tar.gz
tar xvzf redis-stable.tar.gz
cd redis-stable
make install
cd utils
yes "" | ./install_server.sh
update-rc.d redis_6379 defaults
cd ..
rm -rf redis-stable.tar.gz
rm -rf redis-stable

# Install virtualenv
pip install virtualenv

# Install nginx
apt-get install -y nginx
