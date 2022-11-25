FROM phusion/baseimage:jammy-1.0.0
ARG SELENDRA_VERSION
LABEL maintainer "@selendrachain"
LABEL description="Selendra client"
RUN apt-get update && apt-get install wget -y
WORKDIR /usr/local/bin
RUN wget https://github.com/selendra/selendra/releases/download/$SELENDRA_VERSION/selendra \
    && chmod +x selendra
EXPOSE 30333 9933 9944
VOLUME ["/data"]
ENTRYPOINT ["selendra"]
