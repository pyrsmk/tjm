FROM node:16.15.0-alpine3.15

# Install multirun.
RUN wget -c https://github.com/nicolas-van/multirun/releases/download/1.1.3/multirun-x86_64-linux-gnu-1.1.3.tar.gz -O - | tar -xz && mv multirun /bin

# Startup.
EXPOSE 80
ENTRYPOINT ["multirun", "sh /usr/bin/service.sh"]
