# DALab_Web

[![Build Status](http://dalab.se.sjtu.edu.cn:8090/buildStatus/icon?job=se-course)](https://github.com/wanghehv1996/SoftwareInnovationClass)

Chen Jiacheng	118037010018

Wang Hui		118037910009

Xiao Yuwei		118037910061

Zou Yue			118037910072

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

需要调整metric-server的刷新频率，则需要修改拉取的目录中的`metrics-server/deploy/1.8+/metrics-server-deployment.yaml`文件，添加刷新频率的一行

```
      - name: metrics-server
        image: registry.cn-hangzhou.aliyuncs.com/google_containers/metrics-server-amd64:v0.3.3 # use aliyun mirror
        imagePullPolicy: Always
        command:
        - /metrics-server
        -  --metric-resolution=5s # add this row
        -  --kubelet-preferred-address-types=InternalIP
        -  --kubelet-insecure-tls
```

注意:修改了metric-resolution后，可以通过`kubectl get --raw "/apis/metrics.k8s.io/v1beta1/nodes"`来看试试监测的情况

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


2. autoscale

```
kubectl autoscale deployment front-end -n se-dalab --cpu-percent=50 --min=1 --max=10
```
测试如下图所示，模拟大量向主页发起的常规请求，可以发现 front-end pod 会自动增加 replica 至 3 个。
![autoscale](doc/images/autoscale.png)

## Docker

### Build image

通过写 Dockerfile 为每一个微服务创建 image。其中 front-end 使用了 react 框架。因此在前段 build 过程中，需要安装部分依赖包。若每次 docker build 都从干净的 node image 上做，需要每次下载依赖包，十分耗时。因此，我们在 dockerfile 中通过提前单独 COPY package.json 和 package-lock.json 文件，进行 `npm install`。利用 docker 缓存 build 镜像，加速镜像构建。

由于涉及到 node 和 go 两个依赖包，需要使用 multistage build。构建完前段工程后，仅需保留build输出即可，我们将该输出直接复制到 go 基础镜像上，再进一步配置 go 相关配置即可。具体脚本代码请参考 `front-end/Dockerfile` 与 `people/Dockerfile` 两个文件。

我们发现，构建完的镜像大小达到700+MB。按道理，go组件的大小应该比较小。我们可以通过从go基础镜像中复制必要go环境至空镜像中，进一步优化减少镜像大小。

[ref:multistage-build](https://docs.docker.com/develop/develop-images/multistage-build/)


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

安装完以后的主界面如下所示。

![jenkins](doc/images/jenkins.png)


### Github Webhook

1. Jenkins 中下载 github 插件，需要配置一些 auth token。

2. 在 github 项目 Setting->Webhook 中添加 Jenkins 服务器信息。URL 一般为 `hostname:port/github-webhook/`，注意最后的斜杠不能少。

### SSH publish

项目在打包机(部署Jenkins的机器)上 build，然后需要在另一台节点机器上进行部署。我们使用 Jenkins 插件 SSH publisher 来实现这个目标。安装插件后，配置免密登陆。将打包好的Docker镜像和 yaml 部署文件传输到节点机器，在节点机器上执行 `docker load` 和 相关kubectl部署指令即可。

如下为部分配置截图。

![ssh_publisher](doc/images/ssh_publisher.png)

[ref:ssh_publisher_install](https://blog.csdn.net/houyefeng/article/details/51027885)


## Jaeger

### Installation
配置好 kubernetes 后，直接安装即可。
```
kubectl create -f https://raw.githubusercontent.com/jaegertracing/jaeger-kubernetes/master/all-in-one/jaeger-all-in-one-template.yml
```
通过 `localhost:32343` 访问即可，如下图所示。

![jeager](./doc/images/jeager.png)

## Ingress-Nginx

Ingress-Nginx用于统一转发请求到服务。

### Installation

安装

```
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/master/deploy/mandatory.yaml
```

### Configuration

1. 开启NodePort提供访问

```
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/master/deploy/provider/baremetal/service-nodeport.yaml
```

2. 检查容器状态

```
kubectl get pods --all-namespaces -l app.kubernetes.io/name=ingress-nginx --watch
```

3. 创建ingress配置文件

```
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: ingress
  namespace: se-dalab # same as service namespace
  annotations:
    # use the shared ingress-nginx
    kubernetes.io/ingress.class: "nginx"
    nginx.ingress.kubernetes.io/ssl-redirect: "false"
    ingress.kubernetes.io/add-base-url: "true"
spec:
  rules:
   - http:
       paths:
       - path: /web/*
         backend:
           serviceName: se-course
           servicePort: 80
       - path:
         backend:
           serviceName: se-course
           servicePort: 80
```

4. 开启ingress

## HAProxy

通过HAProxy可以便捷地实现多个服务器之间的负载平衡

### Installation

通过apt get安装haproxy。

```
sudo apt-get install -y haproxy
```

### Configuration

默认的haproxy配置文件目录在`/etc/haproxy/haproxy.cfg`中，打开文件，添加如下内容

```
frontend httpsfront
        bind *:78
        mode tcp
        default_backend httpsback
backend httpsback
        mode tcp
        balance roundrobin
        stick-table type ip size 200k expire 30m
        stick on src
        server node1 [IP:port] check
	server node2 [IP:port] check
```

这里实现了一个https请求的负载平衡。前端监听来自端口78的请求，并由后端httpsback转发请求。这里使用roundrobin方法，在提供的两个服务器node1和node2上进行负载平衡（node1的名字和真实节点无关）。可以将此处的server填写成上一步中的ingress service的地址。

### Start HAProxy

启动服务

```
sudo service haproxy start
```

检查服务状态

```
systemctl status haproxy.service
```

正确启动后，便可以通过上述的78端口访问服务，并且多个请求可以被平衡转发到不同服务器上
