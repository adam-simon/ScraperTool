Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/trusty64"
  config.vm.provision :shell, path: "bootstrap.sh"
  config.vm.network :forwarded_port, host:8080, guest: 80
  config.vm.network :forwarded_port, host:8001, guest: 8001
  config.vm.network :forwarded_port, host:8081, guest: 8000
  config.vm.provider "virtualbox" do |v|
    v.memory = 2048
    v.cpus = 2
  end
end
