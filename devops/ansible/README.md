```bash
pip install girder_client
ansible-galaxy install -r requirements.yml
ansible-playbook -i localhost -e edpadmin_password=<secret> site.yml
```
