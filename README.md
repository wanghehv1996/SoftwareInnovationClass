# DALab_Web

[![Build Status](http://dalab.se.sjtu.edu.cn:8090/buildStatus/icon?job=se-course)](https://github.com/wanghehv1996/SoftwareInnovationClass)


## 需求

* 前端
    * 新闻 (news)
    * publication
    * people
    * group (项目组介绍)
* 支持登陆，internal
* 登陆后
    * 每个人可以管理个人主页
        * 主页其实都是静态文件，需要提供主页仓库或者源代码
    * 管理员可以修改 publication, people, news
    * 私人 ftp
    * 组会管理/查看
    * 报销
    * 项目管理 （这个有点烦）

* auto pull test

## Kubernetes

### Installation & Configuration

1. 添加阿里云 apt source, `/etc/apt/sources.list`
```
deb http://mirrors.aliyun.com/ubuntu/ xenial main
deb-src http://mirrors.aliyun.com/ubuntu/ xenial main

deb http://mirrors.aliyun.com/ubuntu/ xenial-updates main
deb-src http://mirrors.aliyun.com/ubuntu/ xenial-updates main

deb http://mirrors.aliyun.com/ubuntu/ xenial universe
deb-src http://mirrors.aliyun.com/ubuntu/ xenial universe
deb http://mirrors.aliyun.com/ubuntu/ xenial-updates universe
deb-src http://mirrors.aliyun.com/ubuntu/ xenial-updates universe

deb http://mirrors.aliyun.com/ubuntu/ xenial-security main
deb-src http://mirrors.aliyun.com/ubuntu/ xenial-security main
deb http://mirrors.aliyun.com/ubuntu/ xenial-security universe
deb-src http://mirrors.aliyun.com/ubuntu/ xenial-security universe
```

2. apt 安装
```
apt-get update && apt-get install -y apt-transport-https
curl https://mirrors.aliyun.com/kubernetes/apt/doc/apt-key.gpg | apt-key add - 
```  
添加 `deb https://mirrors.aliyun.com/kubernetes/apt/ kubernetes-xenial main` 至 `/etc/apt/sources.list.d/kubernetes.list`
```
apt-get update
apt-get install -y kubelet kubeadm kubectl
```

3. 从阿里云拉取 kubeadm 需要的镜像
```
kubeadm config images list
```
拿到需要的镜像列表
```
#!/bin/bash
images=(
	kube-apiserver:v1.15.0
    kube-controller-manager:v1.15.0
    kube-scheduler:v1.15.0
    kube-proxy:v1.15.0
    pause:3.1
    etcd:3.3.10
    coredns:1.3.1
)

for imageName in ${images[@]} ; do
    docker pull registry.cn-hangzhou.aliyuncs.com/google_containers/$imageName
    docker tag registry.cn-hangzhou.aliyuncs.com/google_containers/$imageName k8s.gcr.io/$imageName
done
```
使用如上 shell 脚本提前获取镜像

4. 启动 master
```
sudo kubeadm init --pod-network-cidr=172.16.0.0/16
```

5. 测试
```
curl https://127.0.0.1:6443 -k
```

6. Calico network
先拉镜像
```
docker pull quay.io/calico/node:v3.1.3
docker pull quay.io/calico/cni:v3.1.3
docker pull quay.io/calico/typha:v0.7.4
```
需要先把 yaml 配置拉下来改一下 cidr, CALICO_IPV4POOL_CIDR = 172.16.0.0/16
```
wget https://docs.projectcalico.org/v3.1/getting-started/kubernetes/installation/hosted/kubernetes-datastore/calico-networking/1.7/calico.yaml
```

然后安装
```
kubectl apply -f https://docs.projectcalico.org/v3.1/getting-started/kubernetes/installation/hosted/rbac-kdd.yaml
kubectl apply -f calico.yaml
```
用如下指令检查，create结束以后，应该status都是running。
```
kubectl get pods --all-namespaces
```
这里可能会卡住 coredns 一直在 crashLoop，用`kubectl describe pod <coredns> --namespace=kube-system`查看可以发现Event里有`0/1 nodes are available: 1 node(s) had taints that the pod didn't tolerate.` 使用下面指令允许master taint
```
kubectl taint nodes --all node-role.kubernetes.io/master-
```
[ref:install_calico](https://juejin.im/post/5b8a4536e51d4538c545645c#heading-18)
[ref:set_cidr](https://zhuanlan.zhihu.com/p/31398416)
[ref:allow_taint](https://medium.com/htc-research-engineering-blog/install-a-kubernetes-cluster-with-kubeadm-on-ubuntu-step-by-stepff-c118514bc5e0)

8. dashboard
先安装
```
kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v1.10.1/src/deploy/recommended/kubernetes-dashboard.yaml
```
通过proxy访问 `kubectl proxy`, 浏览器打开 `http://localhost:8001/api/v1/namespaces/kube-system/services/https:kubernetes-dashboard:/proxy/`。查看dashboard需要token验证。如下为 admin-user.yaml 配置，使用`kubectl create -f admin-user.yaml`应用。
```
kind: ClusterRoleBinding
apiVersion: rbac.authorization.k8s.io/v1beta1
metadata:
  name: admin
  annotations:
    rbac.authorization.kubernetes.io/autoupdate: "true"
roleRef:
  kind: ClusterRole
  name: cluster-admin
  apiGroup: rbac.authorization.k8s.io
subjects:
- kind: ServiceAccount
  name: admin
  namespace: kube-system
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: admin
  namespace: kube-system
  labels:
    kubernetes.io/cluster-service: "true"
    addonmanager.kubernetes.io/mode: Reconcile
```
使用`kubectl get secret -n kube-system | grep admin`获取admin token key name. 然后使用 `kubectl -n kube-system get secret admin-token-whj4t -o jsonpath={.data.token}|base64 -d` 拿到token。目前配置中，token为
```
eyJhbGciOiJSUzI1NiIsImtpZCI6IiJ9.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJrdWJlLXN5c3RlbSIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VjcmV0Lm5hbWUiOiJhZG1pbi10b2tlbi1qc2h2NyIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VydmljZS1hY2NvdW50Lm5hbWUiOiJhZG1pbiIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VydmljZS1hY2NvdW50LnVpZCI6ImZkOWEzMDllLWNiNjUtNDBiOC1hZDIzLTNmZjE1MWQ1MTcyNiIsInN1YiI6InN5c3RlbTpzZXJ2aWNlYWNjb3VudDprdWJlLXN5c3RlbTphZG1pbiJ9.tnJGsUFmPF-zGKmniAw7MYqnMmUWYmFbdZspbFnNk0ERXTwxNtcZf5NCZqqM_yAXH5yZ4B5M6jjc7WoQXV5IF09Pc7T_VjT1YcqNOXHGDAglICZZHPOIV8FdeOGk-POXEbEFmAFXdGSYeNNQg3bwKzS72-xwL_yEc12-A5YW7CYr4vph5bOa_orBoYzxmenrMSTuU_gGWFiYaO_hEZiZwotjvazMiZ75ACi3XjSofb4UOGXCIcirSEh0qy0-pHWgM3_qYqAZFoOYtTld2jhU2jsIlTztGDL1lT6KmNblW7-bJyQ3fb92pcFc6vd8U7uPtBXkcFYS_DD4xlp5ut3snQ
```
登陆后如图所示
![dashboard-example](./doc/images/dashboard.png)

[ref:install](https://github.com/kubernetes/dashboard)
[ref:token-admin](https://andrewpqc.github.io/2018/04/25/k8s-dashboard-auth/)

7. metrics-server
完全按照参考教程即可。镜像使用阿里云`registry.cn-hangzhou.aliyuncs.com/google_containers/`
[ref:install](https://www.cnblogs.com/ding2016/p/10786252.html)

7. 测试集群
使用官方的demo sock shop
```
kubectl create namespace sock-shop
kubectl apply -n sock-shop -f "https://github.com/microservices-demo/microservices-demo/blob/master/deploy/kubernetes/complete-demo.yaml?raw=true"
```
部署完成以后，用`kubectl -n sock-shop get svc front-end`查看部署端口，访问如果正常说明配置ok。

[ref:install](https://juejin.im/post/5b8a4536e51d4538c545645c#heading-18)

7. 加入其他节点
```
kubeadm join --token <token> <master-ip>:<master-port> --discovery-token-ca-cert-hash sha256:<hash>
```
用`kubectl get nodes`查看新加入的机器


### Others

1. Clear kubeadm
```
kubeadm reset
etcdctl del "" --prefix
```
[reference](https://k8smeetup.github.io/docs/reference/setup-tools/kubeadm/kubeadm-reset/)