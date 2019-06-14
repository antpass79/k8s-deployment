# Nginx Configuration

Specifying:

    listen <<port>>;

nginx listens to that port and when you run a container with *kubectl run* command you have to specify the flag:

    --port=<<port>>

In this way you are saying that the container port is

        <<port>>

See below:

    http {
        server {
            ...
            listen <<port>>;
            ...


If you want that you application is visible under:

    <<ip>>:<<port>>/<<custom_url_part>>

You must define:

    location /<<custom_url_part>>

See below:

    http {
        server {
            ...
            location /<<custom_url_part>>;
            ...
