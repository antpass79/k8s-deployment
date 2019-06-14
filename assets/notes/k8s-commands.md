# K8s Commands

For some commands it's necessary to use PowerShell.

## Commands

### Build Image

For building images in minikube context:

    minikube docker-env
    minikube docker-env | Invoke-Expression

Now the *docker build* command works in minikube context:

    docker build -t <<image_name[:tag]>> .

### Start Container

Type:

     minikube run <<container_name>> --image=<<image_name[:tag]>> --port=<<port>>

Typing:

    minikube run --help

The description for *--port* flag is: *The port that this container exposes.  If --expose is true, this is also the port used by the service
that is created*

### Debugging node.js application

To debug with Visual Studio Code an application running in a pod follow these steps:

- In the Dockerfile run with *--inspect* flag:

        CMD node --inspect <<entrypoint>>.js

- Run:

        kubectl port-forward <<pod_name>> 9929

- In VSC, define a configuration under .vscode/launch.json:

        {
            "type": "node",
            "request": "attach",
            "name": "Attach",
            "port": 9229,
            "localRoot": "${workspaceRoot}",
            "remoteRoot": "/<<entrypoint_root_folder>>"
        }

    the 9229 is the default port for inspecting the application.

- Start Debugging from VSC
