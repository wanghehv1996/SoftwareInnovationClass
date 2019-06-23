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
卸载 `kubectl delete namespace sock-shop`
[ref:install](https://juejin.im/post/5b8a4536e51d4538c545645c#heading-18)

7. 加入其他节点
```
kubeadm join --token <token> <master-ip>:<master-port> --discovery-token-ca-cert-hash sha256:<hash>
```
用`kubectl get nodes`查看新加入的机器

8. 部署集群

[ref:port](https://www.jianshu.com/p/75af95641c91), [ref:port](https://blog.csdn.net/xinghun_4/article/details/50492041), 
[ref:image_pull_policy](https://www.cnblogs.com/flying1819/articles/8311342.html)

### Others

1. Clear kubeadm
```
kubeadm reset
etcdctl del "" --prefix
```
[reference](https://k8smeetup.github.io/docs/reference/setup-tools/kubeadm/kubeadm-reset/)

## Docker

### Docker registry

使用如下指令在本地启动registry容器，暴露5000端口
```
docker run -d -p 5000:5000 --restart=always --name registry registry:2
```
具体如何将本地image发布到registry可参考教程。但是Docker registry在本地局域网也需要域名和https证书验证，因此实际部署中使用更简单的 `docker save, docker load`来实现image在本地的共享。

[ref:install](https://docs.docker.com/registry/deploying/)

### Docker image share in LAN network

先通过本地将build好的image打包到文件。使用`bzip2`压缩，`pv`可视化进度。
```
docker save se-course | bzip2 | pv | cat se-course-image
```
使用jenkins将文件从打包机传输到节点，并执行解压缩，load到docker
```
cat <path-to-image>/se-course-image | pv | bunzip2 | docker load
```

## Jenkins

### Installation

参考[教程](https://www.digitalocean.com/community/tutorials/how-to-install-jenkins-on-ubuntu-16-04)按步骤即可。其中防火墙一般不需要设置。

### Github Webhook

1. Jenkins 中下载 github 插件，需要配置一些 auth token。

2. 在 github 项目 Setting->Webhook 中添加 Jenkins 服务器信息。URL 一般为 `hostname:port/github-webhook/`，注意最后的斜杠不能少。

### SSH publish

项目在打包机(部署Jenkins的机器)上 build，然后需要在另一台节点机器上进行部署。我们使用 Jenkins 插件 SSH publisher 来实现这个目标。安装插件后，配置免密登陆。将打包好的Docker镜像和 yaml 部署文件传输到节点机器，在节点机器上执行 `docker load` 和 相关kubectl部署指令即可。

[ref:ssh_publisher_install](https://blog.csdn.net/houyefeng/article/details/51027885)