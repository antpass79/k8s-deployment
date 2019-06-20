# Introduction

The goal of the project is to better undestand how to manage k8s deployments.

The system is very easy, it's composed by:

- frontend: ReactJS application for the interaction with the user.
- backend: node.js application for exposing web api.
- database: mongoDB for storing data.

The user interacts with the ReactJS application and can do the following actions:

- send (and store) a message.
- load all sent messages.
- clear all messages.

## The Architecture

The schema below shows the distribution of the components on k8s. Based on this architecture, in the following sections I'll do some experiments in order to undestand "what happens if I do...".

![k8s-diagram](assets/images/k8s-diagram.jpg)

## Goals

Here there is the list of what I would like to learn:

- understand adresses and ports for all actors in k8s.
- manage pods and nodes in a cluster.
- expose the frontend on Internet through services and ingresses.
- store data by volumes.
- change configuration on the fly.

Now we can the application in different environments, in order to understand what are the steps that I did to deploy on k8s:

- [Run Locally](assets/notes/readme/run-locally.md)
- [Run on Minikube](assets/notes/readme/run-on-minikube.md)

In the sections below there are commands and examples useful fo this project:

- [Docker Commands](assets/notes/docker-commands.md)
- [K8s Commands](assets/notes/k8s-commands.md)
- [Nginx Configuration](assets/notes/nginx-configuration.md)

## References

In the following sections there are links useful during the development of the project, not only closed to the goals described above. Following the links above to run the application in different environments, you can find other links at the end of the links themself.

### ReactJS

- https://facebook.github.io/create-react-app/docs/adding-typescript.

### Node.js

- https://blog.risingstack.com/building-a-node-js-app-with-typescript-tutorial/
