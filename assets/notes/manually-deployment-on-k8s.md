# Manual Deployment

## Frontend

For **creating the docker image**, under the frontend folder, type:

        docker build -t k8s-frontend .

For **creating the deployment and run the pod**, type:

    kubectl run k8s-frontend --image=k8s-frontend --image-pull-policy=Never --port=80

NOTE:

- run commands in a PowerShell prompt.
- it's important to specified the flag *--image-pull-policy* as *Never* or *IfNotPresent* (the default seems to be *Always*), otherwise minikube tries to download the image from a remote repository, causing a wrong deployment if the image is not present (on Visual Studio Code k8s plugin you can see a red icon under the deployments root).
- the value 80 for the flag *--port* coming from the fact that in the nginx config file the server listens at port 80. *--port* specifies the container port, then when a service is created, you have to specify the mapping from container port to service port.
- the *EXPOSE* in Dockerfile is not really useful. It's used for documentation or for *docker run -P* command for automapping.
- if you update the deployment after creating the service, you have to creating again also the service in case you changed the container port, because in the service definition the port mapping is set to the old value.
- if you don't specify the *--port*, during the creation of the service, you'll receive this error:

    *error: couldn't find port via --port flag or introspection
See 'kubectl expose -h' for help and examples*

For **creating the service** type:

    kubectl expose deployment k8s-frontend --type=NodePort

With minikube is not immediate to expose a service with *LoadBalancer*, so for the project I used *NodePort*.

Now it's possible to see on the browser the frontend application typing:

    minikube service k8s-frontend --url

The command shows this:

    <<minikube_ip>>:<<service_port>>

You can reach the same result following these steps:

- type: *minikube ip* => get *minikube_ip*
- type: *kubectl get services* => get all services. Under the port column *container_port:service_port*
- the result is: *minikube_ip:service_port*

## Backend

For exposing the k8s-backend as a service browsable outside of k8s, the procedure is similar to the k8s-frontend.

For **creating the docker image**, under the backend folder, type:

        docker build -t k8s-backend .

For **creating the deployment and run the pod**, type:

    kubectl run k8s-backend --image=k8s-backend --image-pull-policy=Never --port=8080

For **creating the service** type:

    kubectl expose deployment k8s-backend --type=NodePort

Now it's possible to see on the browser the backend application typing:

    minikube service k8s-frontend --url