# Docker Commands

For some commands it's necessary to use PowerShell.

## Dockerfile

If you have an site under nginx, the right way to run the server is to use the following command in the Dockerfile:

    ENTRYPOINT ["nginx","-g","daemon off;"]

## Commands

### Build an image

    docker build -t <<image_name[:tag]>> .

Typing:

    docker image build --help

The description for *-t* flag is: *Name and optionally a tag in the 'name:tag' format*

### Remove Images

    docker image rm <<image_id1>> <<image_id2>>

Use *--force* flag if you want to remove images also if there are containers associated to images.

### Start Container

For ports handle, see:
- https://docs.docker.com/v17.12/edge/engine/reference/commandline/run/#add-bind-mounts-or-volumes-using-the-mount-flag
- https://docs.docker.com/network/links/

Type:

     docker run -p <<host_port_rangeA>>[-<<host_port_rangeB>>]:<<container_port>> -t <<image_name[:tag]>>

Typing:

    docker run --help

The description for *-i* flag is: *Keep STDIN open even if not attached*

Type:

     docker run --expose <<container_port>> -t <<image_name[:tag]>>

The above command exposes the container through port 80, without publishing the port to the host system's interfaces.

For differences between publish and expose, see:

https://www.freecodecamp.org/news/expose-vs-publish-docker-port-commands-explained-simply-434593dbc9a3/

### Stop and remove Containers

For a list of all running containers type:

    docker ps

For a list of all containers type:

    docker ps -a

The first column shows the container id.

To stop containers type:

    docker container stop <<container_id_1>> <<container_id_2>> ...

To remove containers type:

    docker container rm <<container_id_1>> <<container_id_2>> ...

### Container Bash

For exploring a container you can choose 2 options:

- From Visual Studio Code go to k8s *plugin -> Workloads -> "your-deployment_name" -> context menu -> Terminal*
- From cmd:

        docker exec -it <<container_id>> /bin/sh

    To obtain the id of container type:

        docker ps [-a]

    For the list of running container [all container].

Once you are inside the container you can:

- list all executables:

        ps falx

- kill a process:

        ps falx

    or

        ps aux

    then

        kill <<PID>>

If you want to run a process, for example a node.js application, with a valorized env variable:

    <<ENV_VAR>>=<<VALUE>> node <<entrypoint>>.js

Inside the code must be:

    process.env.<<ENV_VAR>>

A concrete example is if you want to run node on a specified port:

    LISTEN_PORT=3000 node server.js

In server.js:

    const port = process.env.LISTEN_PORT || 8080;
    let server = new Server(port);
    server.start();

For the file list type:

    ls

For the folder list type:

    ls -l | grep "^d"

or

    ls -d -- */

### Miscellaneous Commands

- Display the list of process inside a container:

        docker top <<container_id>>
