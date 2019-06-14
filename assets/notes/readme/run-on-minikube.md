# Run on Minikube

First of all install minikube, following one of many example on Internet.

In order to set the minikube context, you need to use the minikube deamon for building images through *docker build* command (use PowerShell).

    minikube docker-env
    minikube docker-env | Invoke-Expression

Note:
The context is related to the PowerShell instance.

## Deployment

To deploy the system on k8s, you can choose different ways:

- [Manual Deployment](#manual-deployment)
- [Yaml Deployment](#yaml-deployment)
- [Heml Deployment](#heml-deployment)

The best and robust approach is to use heml, but now I want to explore the first two methods, in order to better understand all steps.

You can skip the sections not interesting for you.

### Manual Deployment

The manual deployment is made only for the frontend and the backend applications, the database is on the local machine.

I start from the **frontend deployment**.

Under the frontend folder, **build the bundle** typing:

    npm run build

For **creating the docker image**, under the frontend folder, type:

    docker build -t k8s-frontend . -f Dockerfile-manual-deployment

Adding the *-f* flag, it's possible to select the Dockerfile.

For **creating the deployment and run the pod**, type:

    kubectl run k8s-frontend --image=k8s-frontend --image-pull-policy=Never --port=80

NOTES:

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

Now it's possible to see on the browser the frontend application. To know the url, typing:

    minikube service k8s-frontend --url

The command shows this:

    <<minikube_ip>>:<<service_port>>

You can reach the same result following these steps:

- type: *minikube ip* => get *minikube_ip*
- type: *kubectl get services* => get all services. Under the port column *container_port:service_port*
- the result is: *minikube_ip:service_port*

For **exposing the backend** as a service browsable outside of k8s, the procedure is similar to the k8s-frontend.

First of all, because I said before that I don't want to deploy the database on the server, under *backend->assets->config.json*, set:

    "CONNECTION_STRING": "mongodb://localhost/",

Under the backend folder, **build the bundle** typing:

    npm run build

For **creating the docker image**, under the backend folder, type:

    docker build -t k8s-backend .

In this case the Dockerfile is the same for manual and yaml deployment.

For **creating the deployment and run the pod**, type:

    kubectl run k8s-backend --image=k8s-backend --image-pull-policy=Never --port=8080

For **creating the service** type:

    kubectl expose deployment k8s-backend --type=NodePort

Now it's possible to see on the browser the backend application. To know the url, typing:

    minikube service k8s-frontend --url

### Yaml Deployment

The deployment through yaml definition is made with three yaml files:

- k8s-frontend.yaml
- k8s-backend.yaml
- k8s-database.yaml

The final goal is to have the frontend and backend exposed to external and the database visible only inside the k8s system.

The first thing to do is passing variables to components in order to have a good level of configuration without compiling every time that something change. For more information see the [Environment Variables](#Environment-Variables).

For starting I expose to external world all components in order to semplify the test.

The following commands must be executed under the folder k8s, where there are all yaml files.

The first step is to **expose the database**:

    kubectl apply -f k8s-database.yaml [--force]

The *--force* flag permits to force a new deployment on k8s wihout deleting the current deployment every time.

To test the database on k8s, the easiest way is to run locally the server, applying before changes in assets.json:

    "CONNECTION_STRING": "mongodb://<<minikube_ip>>:30070/",

For minikube ip type:

    minikube ip

The default port specified in the yaml file *30070*.

Now with Fiddler you can use directly the backend. Otherwise you can run also the frontend and use it.

Now I **expose the backend**:

    kubectl apply -f k8s-backend.yaml [--force]

In the yaml file there are few environment variables. Those that can be changed are:

- CONNECTION_STRING: "mongodb://minikube_ip:30070/"
- ORIGINS_WHITE_LIST: "['http://localhost:3000', 'http://minikube_ip:30050']"

With these settings it's possible to test the backend with a frontend running locally on the port 3000, but you need to change the file env_config.js under public folder:

    SERVER_ENDPOINT: "http://minikube_ip:30060/"

where the port value *30060* coming from the *nodePort* specified in the service section of the yaml file.

Obviously, it's possible to decide where running the database, locally or on k8s.

The last step is to **expose the frontend**, typing:

    kubectl apply -f k8s-frontend.yaml [--force]

The Dockerfile has not a *CMD* or *ENTRYPOINT* specified. It is left at deployment time, in order to run env-runtime.sh for updating the env-config.js (see *Fontend Configuration* in [Run Locally](run-locally.md)), based on env section in yaml file, in which there are all environment variables used in the code.

The 2 sections above are useful when there is one only application or 2 applications that must communicate each other. But for complex systems in which there are many components involved, the yaml file comes in help.
This system is composed by:

    - frontend
    - backend
    - database

It's a simple system, of course, but to understand what kind of configurations is possible to apply is a good starting point.

### Environment Variables

For the backend application, that's easy. Once you have defined the **env** section for a container in the Deployment definition of the yaml file:

    ...
    kind: Deployment
    ...
        spec:
         containers:
         ...
            env:
                - name: <<ENV_VAR_NAME>>
                  value: "<<ENV_VAR_VALUE>>"
        ...

the variables can be accessed in the code by:

    let <<ENV_VAR_VALUE>> = process.env.<<ENV_VAR_NAME>>;

In the backend project the class *NodeConfig* wraps the access to configuration variables coming from *config.json* or from *process.env*.

For the frontend, it's more complex.
The *env-runtime.sh* permits to create the env-config.js with all variables used in the code, when the container runs.

If you run the script without parameters, the script generates a env-config.js with default values and put them in window variable.
The file is linked in index.html:

    <script type="text/javascript" src="env-config.js"></script>

All variables to pass to the container during running command are defined in k8s-frontend.yaml:

    ...
    env:
        - name: <<VAR_NAME_1>>
          value: ">>VAR_VALUE_1>>"
        - name: <<VAR_NAME_2>>
          value: "<<VAR_VALUE_2>>"
    command: ["/usr/share/nginx/html/env-runtime.sh"]
    args: ["-c", "$(<<VAR_NAME_1>>)", "$(<<VAR_NAME_2>>)" ]
    ...

In this way, when you run under the folder k8s:

    kubectl apply -f .\k8s-frontend.yaml [--force]

The script will run with specified environment variables.
The script, as last job, runs nginx.

*--force* flag permits to update the deployment also if the deployment already exists on k8s, without to delete it before.

## Resources

For a better usage of resources, in order to not have problems running containers, the following section must be specified for each container, backend, frontend and database:

    ...
    resources:
        requests:
            cpu: "0.3"
            memory: "500Mi"
    ...

## References

### k8s - Debug

- https://supergiant.io/blog/how-to-debug-kubernetes-applications/
- https://medium.com/collaborne-engineering/remote-debug-nodejs-in-kubernetes-with-vs-code-d0282eae4388

### k8s - Resources

- https://supergiant.io/blog/managing-memory-and-cpu-resources-for-kubernetes-namespaces/

### k8s - Environment Variables

- https://felipelinsmachado.com/runtime-environment-variable-using-docker-and-create-react-app/
- https://blog.codecentric.de/en/2018/12/react-application-container-environment-aware-kubernetes-deployment/

### k8s - MongoDB

- https://github.com/fabric8io/configmapcontroller/tree/master/vendor/k8s.io/kubernetes/examples/nodesjs-mongodb
- https://developer.ibm.com/recipes/tutorials/kubernetes-how-to-run-a-node-js-application-which-accesses-mongo-database-where-both-are-running-in-containers-in-different-pods/

### k8s - Miscellaneous

- https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/
- https://stackoverflow.com/questions/41325087/what-is-the-difference-between-a-pod-and-a-deployment

### Docker

- https://medium.com/yld-engineering-blog/deploy-your-create-react-app-with-docker-and-ngnix-653e94ffb537
- https://medium.com/@Grigorkh/docker-for-beginners-part-2-running-your-first-container-7cb1ef829f79
- https://medium.com/@becintec/building-graceful-node-applications-in-docker-4d2cd4d5d392

### nginx

- https://www.linode.com/docs/web-servers/nginx/how-to-configure-nginx/
